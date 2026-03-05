# Grading Assistant (TA) Feature - Implementation Guide

## Overview

The Grading Assistant feature allows faculty members to invite students to assist with grading in their courses. Once a student accepts the invitation, they gain limited grading permissions for that specific course.

---

## Architecture

### 1. Database Models

#### **Enrollment** (modified)
- Added `role` field: `student`, `ta`, `instructor`
- Faculty who create courses are automatically enrolled as `instructor`
- Students who accept TA invitations have their role updated to `ta`

#### **TAInvitation** (new)
```sql
CREATE TABLE ta_invitations (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    faculty_id INTEGER NOT NULL,
    status VARCHAR DEFAULT 'pending',  -- pending, accepted, declined
    created_at TIMESTAMP,
    responded_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (faculty_id) REFERENCES users(id)
);
```

#### **Course** (modified)
- Added optional `faculty_id` field for reference (not actively used in permissions)
- Primary authority comes from Enrollment with role='instructor'

---

## API Endpoints

### Faculty Endpoints

#### Send TA Invitation
```
POST /api/ta/courses/{course_id}/invite
Authorization: Bearer <faculty_token>

Request Body:
{
    "student_id": 5
}

Response:
{
    "id": 1,
    "course_id": 3,
    "student_id": 5,
    "faculty_id": 2,
    "status": "pending",
    "created_at": "2026-03-01T10:00:00Z",
    "responded_at": null
}
```

#### Get Course TA Invitations
```
GET /api/ta/courses/{course_id}/invitations
Authorization: Bearer <faculty_token>

Response:
[
    {
        "id": 1,
        "course_id": 3,
        "student_id": 5,
        "faculty_id": 2,
        "status": "accepted",
        "created_at": "2026-03-01T10:00:00Z",
        "responded_at": "2026-03-01T10:05:00Z"
    }
]
```

### Student Endpoints

#### Get My TA Invitations
```
GET /api/ta/me/invitations
Authorization: Bearer <student_token>

Response:
[
    {
        "id": 1,
        "course_id": 3,
        "student_id": 5,
        "faculty_id": 2,
        "status": "pending",
        "created_at": "2026-03-01T10:00:00Z",
        "responded_at": null,
        "course_name": "Introduction to Python",
        "course_code": "CS101",
        "instructor_name": "Dr. Smith",
        "student_name": "John Doe"
    }
]
```

#### Respond to Invitation
```
POST /api/ta/invitations/{invitation_id}/respond
Authorization: Bearer <student_token>

Request Body:
{
    "action": "accept"  // or "decline"
}

Response:
{
    "id": 1,
    "course_id": 3,
    "student_id": 5,
    "faculty_id": 2,
    "status": "accepted",
    "created_at": "2026-03-01T10:00:00Z",
    "responded_at": "2026-03-01T10:05:00Z"
}
```

---

## Backend Components

### Services

#### `TAService` (`app/services/ta_service.py`)
- `invite_ta()` - Create TA invitation
- `get_student_invitations()` - Get invitations for a student
- `respond_to_invitation()` - Accept/decline invitation
- `get_invitation_with_details()` - Get invitation with course info
- `get_course_ta_invitations()` - Get all invitations for a course

### Schemas

#### `TAInvitation` Schemas (`app/schemas/ta_invitation.py`)
- `TAInvitationCreate` - Create invitation
- `TAInvitationResponse` - Student response
- `TAInvitationOut` - Invitation output
- `TAInvitationWithDetails` - Extended info

### Routes

#### `ta.py` (`app/api/routes/ta.py`)
- `POST /ta/courses/{course_id}/invite` - Faculty invite
- `GET /ta/courses/{course_id}/invitations` - Faculty view invites
- `GET /ta/me/invitations` - Student view invites
- `POST /ta/invitations/{id}/respond` - Student respond

---

## Frontend Components

### Faculty Component

#### `TAManagement.tsx`
Location: `src/components/TAManagement.tsx`

Props:
```typescript
interface TAManagementProps {
  courseId: number;
  enrolledStudents: GradeEnrollment[];  // List of course students
  onInvitationSent?: () => void;
}
```

Features:
- Button to open "Invite TA" modal
- Dropdown to select enrolled students
- Shows active TAs and pending invitations
- Handles invitation sending with error/success messages

Usage:
```tsx
<TAManagement 
  courseId={courseId}
  enrolledStudents={students}
  onInvitationSent={() => refreshData()}
/>
```

### Student Component

#### `TAInvitations.tsx`
Location: `src/components/TAInvitations.tsx`

Props:
```typescript
interface TAInvitationsProps {
  onAccepted?: () => void;
}
```

Features:
- Displays pending invitations with course details
- Shows active TA roles
- Accept/Decline buttons with loading states
- Detailed info about TA responsibilities

Usage:
```tsx
<TAInvitations onAccepted={() => refreshDashboard()} />
```

### Service

#### `taService.ts`
Location: `src/services/api/taService.ts`

Exported functions:
- `inviteTA(courseId, studentId)` - Send invitation
- `getCourseInvitations(courseId)` - Get faculty view
- `getMyInvitations()` - Get student invitations
- `acceptInvitation(invitationId)` - Accept
- `declineInvitation(invitationId)` - Decline

---

## Permissions & Access Control

### Role-Based Authorization

#### Faculty
- Can only send invitations for courses they teach (enrollment role = "instructor")
- Can view all invitations for their courses
- Cannot change TA status directly through enroll API

#### Student
- Can receive invitations
- Can accept/decline invitations
- No access to send or view other students' invitations
- Access to accept invitation requires them to be the recipient

#### TA (after acceptance)
- Can view student submissions in the course
- Can grade and provide feedback
- Cannot:
  - Delete or archive the course
  - Modify course settings
  - Appoint other TAs
  - Delete or modify assignments

#### Grading Permission Check
In `app/api/routes/grading.py`:
```python
require_course_role(
    db=db,
    user=user,
    course_id=assignment.course_id,
    allowed_roles=["instructor", "ta"],  # TAs can grade
)
```

---

## Data Flow

### Faculty Inviting a Student

```
1. Faculty selects student from course enrollment list
2. Faculty clicks "Appoint as Grading Assistant"
3. Frontend calls: POST /api/ta/courses/{courseId}/invite
4. Backend validates:
   - Faculty is course instructor
   - Student is enrolled
   - No pending invitation exists
5. TAInvitation record created with status="pending"
6. Student sees invitation on dashboard
```

### Student Accepting Invitation

```
1. Student views dashboard
2. Sees "Grading Assistant Invitations" section
3. Reads invitation details (course, instructor)
4. Clicks "Accept"
5. Frontend calls: POST /api/ta/invitations/{id}/respond
   Body: { "action": "accept" }
6. Backend:
   - Updates TAInvitation status="accepted"
   - Updates Enrollment role from "student" to "ta"
7. Student can now grade submissions for that course
8. Invitation moves to "Active" section
```

---

## Testing Workflow

### Test Case 1: Faculty Sends Invitation
```bash
# As faculty user
POST /api/ta/courses/1/invite
{
    "student_id": 3
}

Expected: 200 OK with TAInvitation object
```

### Test Case 2: Student Accepts Invitation
```bash
# Get pending invitations
GET /api/ta/me/invitations

# Accept invitation
POST /api/ta/invitations/1/respond
{
    "action": "accept"
}

Expected: Enrollment role changes from "student" to "ta"
```

### Test Case 3: TA Can Grade
```bash
# As TA user for the course
POST /api/grading/submissions/{submission_id}/grade
{
    "score": 85
}

Expected: 200 OK (permission check passes)
```

### Test Case 4: Student Cannot Manage Course
```bash
# As TA user
PUT /api/courses/1
{
    "name": "New Name"
}

Expected: 403 Forbidden (only instructor can update)
```

---

## Permissions Matrix

| Action | Faculty (Instructor) | TA | Student | Admin |
|--------|---|---|---|---|
| Send TA invite | ✅ | ❌ | ❌ | ✅ |
| Accept/Decline | ❌ | ❌ | ✅ | ❌ |
| View submissions | ✅ | ✅ | ❌ | ✅ |
| Grade submissions | ✅ | ✅ | ❌ | ✅ |
| Update course | ✅ | ❌ | ❌ | ✅ |
| Delete course | ✅ | ❌ | ❌ | ✅ |
| Appoint TA | ✅ | ❌ | ❌ | ✅ |

---

## Integration Points

### Frontend Pages to Update

1. **Faculty Course Detail Page** (`/courses/[courseId]`)
   - Add `<TAManagement>` component to show TA management UI

2. **Faculty Course Settings** (`/courses/[courseId]/settings`)
   - Show list of active TAs
   - Option to remove TA (future enhancement)

3. **Student Dashboard** (`/student`)
   - Add `<TAInvitations>` component to show pending invites
   - Show active TA roles

---

## Error Handling

### Common Error Scenarios

| Scenario | Status | Detail |
|----------|--------|--------|
| Faculty not course instructor | 403 | "Only course instructor can invite TAs" |
| Student not enrolled | 400 | "Student is not enrolled in this course" |
| Pending invite already exists | 400 | "Pending invitation already exists" |
| Student already TA | 400 | "Student is already a TA for this course" |
| Double accept | 400 | "Invitation has already been responded to" |
| Unauthorized access | 403 | "Not authorized to respond to this invitation" |

---

## Future Enhancements

1. **Email Notifications** - Send email when invitation sent/accepted
2. **TA Removal** - Faculty can remove TA role from student
3. **Multiple TAs** - Support multiple TAs per course
4. **TA Requests** - Students can request to be TA
5. **TA Activity Log** - Track grading activity
6. **TA Reports** - Show what TAs graded and their feedback quality
7. **Re-invite** - Allow declining and re-inviting same student
