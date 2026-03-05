# Backend Endpoints Implementation - TA Dashboard

## ✅ Completed: Two New Endpoints

### 1. GET `/api/courses/me` - Get User's Courses by Role
**File:** `backend/app/api/routes/courses.py`
**Location:** After POST `/api/courses/` endpoint

**Purpose:** Get courses where the current user is enrolled, with optional role filtering for TA dashboard

**Endpoint:**
```
GET /api/courses/me?role=ta
Authorization: Bearer <token>
```

**Query Parameters:**
- `role` (optional): Filter by enrollment role
  - `"student"` - Get courses where user is a student
  - `"ta"` - Get courses where user is a teaching assistant
  - `"instructor"` - Get courses where user is an instructor
  - If not provided: Get all courses for the user

**Response:**
```json
[
  {
    "id": 3,
    "name": "Data Structures",
    "code": "CS105",
    "description": "...",
    "enrollment_code": "ABC12XY",
    "enrollment_code_active": true,
    "created_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": 4,
    "name": "Databases",
    "code": "CS210",
    "description": "...",
    "enrollment_code": "DEF45ZQ",
    "enrollment_code_active": true,
    "created_at": "2026-01-20T10:00:00Z"
  }
]
```

**Examples:**

Get all courses where Montana is enrolled:
```bash
curl -H "Authorization: Bearer <montana_token>" \
  http://localhost:8000/api/courses/me
```

Get only courses where Montana is a TA:
```bash
curl -H "Authorization: Bearer <montana_token>" \
  http://localhost:8000/api/courses/me?role=ta
```

Get only courses where Montana is a student:
```bash
curl -H "Authorization: Bearer <montana_token>" \
  http://localhost:8000/api/courses/me?role=student
```

---

### 2. GET `/api/submissions/courses/{course_id}/for-grading` - Get Submissions for Grading
**File:** `backend/app/api/routes/submissions.py`
**Location:** Before GET `/api/submissions/assignments/{assignment_id}` endpoint

**Purpose:** Get all submissions in a course for TA/instructor grading view

**Endpoint:**
```
GET /api/submissions/courses/{course_id}/for-grading
Authorization: Bearer <token>
```

**Path Parameters:**
- `course_id` (required): The course ID

**Query Parameters:**
- `assignment_id` (optional): Filter by specific assignment

**Response:**
```json
[
  {
    "id": 15,
    "assignment_id": 1,
    "assignment_name": "Hello World Program",
    "student_id": 101,
    "student_name": "John Doe",
    "student_email": "john@ulm.edu",
    "status": "submitted",
    "score": 35,
    "max_score": 50,
    "feedback": null,
    "graded_at": null,
    "created_at": "2026-03-01T10:00:00Z",
    "files": [
      {
        "id": 1,
        "filename": "hello.py",
        "file_size": 245
      }
    ]
  },
  {
    "id": 16,
    "assignment_id": 1,
    "assignment_name": "Hello World Program",
    "student_id": 102,
    "student_name": "Jane Smith",
    "student_email": "jane@ulm.edu",
    "status": "graded",
    "score": 45,
    "max_score": 50,
    "feedback": "Good work!",
    "graded_at": "2026-03-02T09:30:00Z",
    "created_at": "2026-03-01T09:45:00Z",
    "files": [
      {
        "id": 2,
        "filename": "hello.py",
        "file_size": 280
      }
    ]
  }
]
```

**Permission Checks:**
- ✅ User must be authenticated
- ✅ User must have role "TA" or "instructor" in the course
- ✅ Returns 403 Forbidden if user doesn't have permission
- ✅ Returns 404 Not Found if course doesn't exist

**Examples:**

Get all submissions in course 3 that need grading:
```bash
curl -H "Authorization: Bearer <montana_token>" \
  http://localhost:8000/api/submissions/courses/3/for-grading
```

Get submissions for a specific assignment:
```bash
curl -H "Authorization: Bearer <montana_token>" \
  http://localhost:8000/api/submissions/courses/3/for-grading?assignment_id=1
```

---

## Testing in Postman or cURL

### Setup:
1. Get a valid token for Montana (student who's also a TA)
2. Montana should have:
   - `enrollment.role = "student"` for some courses (CS101, CS102)
   - `enrollment.role = "ta"` for some courses (CS105, CS210)

### Test 1: Get TA Courses Only
```bash
curl -X GET "http://localhost:8000/api/courses/me?role=ta" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

Expected: Should return only CS105 and CS210 (courses where Montana is TA)

### Test 2: Get TA Submissions for CS105
```bash
curl -X GET "http://localhost:8000/api/submissions/courses/3/for-grading" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

Expected: Should return all student submissions for all assignments in CS105

### Test 3: Get Student Courses Only (for comparison)
```bash
curl -X GET "http://localhost:8000/api/courses/me?role=student" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

Expected: Should return only CS101, CS102, etc. (courses where Montana is a student)

---

## Error Responses

### 403 Forbidden - User not authorized
```json
{
  "detail": "Forbidden: requires course role in ['instructor', 'ta']"
}
```

### 404 Not Found - Course doesn't exist
```json
{
  "detail": "Course not found"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

---

## What's Next (Frontend Implementation)

These endpoints are now ready to be consumed by the frontend components:

1. **API Service Methods** (`frontend/src/services/api/`)
   - Create `getCoursesByRole()` in `courseService.ts`
   - Create `getSubmissionsForGrading()` in `submissionService.ts`

2. **React Query Hooks** (`frontend/src/hooks/queries/`)
   - Create `useTACourses()` hook
   - Create `useSubmissionsForGrading()` hook

3. **Frontend Components** (`frontend/src/components/`)
   - `TeachingAssistantSection.tsx` - Show TA courses on dashboard
   - `TADashboard.tsx` - Full TA page overview

4. **Frontend Pages**
   - `/student/teaching-assistant/page.tsx` - TA Dashboard
   - `/student/teaching-assistant/[courseId]/grading/page.tsx` - Grading interface

---

## Database Verification

The implementation uses existing database schema:
- ✅ `enrollments.role` column (already has "ta" value support)
- ✅ `courses` table (no changes)
- ✅ `submissions` table (no changes)
- ✅ `users` table (no changes)

No database migrations needed!

---

## Important Notes

1. **Route Order:** The new `/courses/{course_id}/for-grading` endpoint is placed BEFORE the generic `/{s_id}` endpoint to avoid routing conflicts

2. **Permission System:** Uses existing `require_course_role()` function that already supports "ta" role

3. **Query Performance:** For large courses with many submissions, the endpoint iterates through submissions. For optimization in future:
   - Add pagination support
   - Add sorting options (by student name, date, status)
   - Consider eager loading with SQLAlchemy `joinedload()`

4. **Response Format:** Returns custom dictionary format (not using Pydantic schemas) to include computed fields like student_name from related models

---

## Status: ✅ COMPLETE

Backend endpoints are implemented and ready for frontend integration!

