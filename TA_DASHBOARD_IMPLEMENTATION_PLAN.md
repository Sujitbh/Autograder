# Teaching Assistant Dashboard Implementation Plan

## Overview
When Montana (a student who's also a TA) logs in, she should see both her student assignments AND a Teaching Assistant section where she can access courses she's a TA for and grade submissions.

---

## Architecture

### Data Structure
Montana's enrollment records:
- Course A: role = "student" (she's taking the course)
- Course B: role = "student" → role = "ta" (she accepted TA invitation)
- Course C: role = "ta" (invited by instructor, accepted)

---

## Implementation Plan

### Phase 1: Backend - API Endpoints

#### 1. Get User Courses by Role
**Endpoint:** `GET /api/courses/me?role=ta`
- Returns courses where user is a TA
- Returns all enrollments with their roles

**Implementation:**
- Modify `courses.py` router
- Add query parameter `role` to filter by enrollment role
- Return list of courses with user's role in each

```python
@router.get("/me", response_model=List[CourseOut])
def get_my_courses(
    role: Optional[str] = None,  # "student", "ta", "instructor"
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get courses for current user, optionally filtered by role."""
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id
    ).all()
    
    courses = []
    for enrollment in enrollments:
        if role and enrollment.role != role:
            continue
        course = db.query(Course).filter(Course.id == enrollment.course_id).first()
        if course:
            courses.append({**course.to_dict(), "user_role": enrollment.role})
    
    return courses
```

#### 2. Get Submissions for TA (for a specific course)
**Endpoint:** `GET /api/submissions/courses/{course_id}/for-grading`
- Returns submissions for all students in a course
- Only accessible if user is TA or instructor for that course
- Filters by assignment if needed

**Implementation:**
- Add to `submissions.py` router
- Check user role in course (must be "ta" or "instructor")
- Return all submissions with student info

### Phase 2: Frontend - Student Dashboard Changes

#### 1. Modify Student Dashboard Layout
**File:** `frontend/src/app/student/page.tsx`

Add two sections:
1. **My Assignments** (existing student enrollments)
2. **Teaching Assistant** (TA enrollments) - NEW

**Structure:**
```tsx
<div>
  {/* Section 1: My Assignments (student role) */}
  <StudentAssignmentsSection courses={studentCourses} role="student" />
  
  {/* Section 2: Teaching Assistant (ta role) - NEW */}
  {taCourses.length > 0 && (
    <TeachingAssistantSection courses={taCourses} />
  )}
</div>
```

#### 2. Create TeachingAssistantSection Component
**File:** `frontend/src/components/TeachingAssistantSection.tsx`

Features:
- Shows courses where user is a TA
- Each course card shows:
  - Course name & code
  - Instructor name
  - Number of assignments
  - Number of pending submissions to grade
- Click to access TA Grading Dashboard

#### 3. Create TA Dashboard Page
**File:** `frontend/src/app/student/teaching-assistant/page.tsx`

Shows:
- List of TA courses
- For each course: assignments with submission counts
- Filter by course, assignment, grading status
- Quick action buttons

#### 4. Create TA Grading Page
**File:** `frontend/src/app/student/teaching-assistant/[courseId]/grading/page.tsx`

Same functionality as faculty grading but:
- Limited to courses where user is TA
- Same submission queue interface
- Same grading modal
- Same test execution and rubric evaluation

### Phase 3: Frontend - Navigation & Sidebar Updates

#### 1. Update Sidebar
**File:** `frontend/src/components/Sidebar.tsx`

Add conditional navigation:
```tsx
{user?.role === 'student' && (
  <>
    <NavItem href="/student" label="My Assignments" />
    {userHasTACourses && (
      <NavItem href="/student/teaching-assistant" label="Teaching Assistant" />
    )}
  </>
)}
```

#### 2. Update Top Navigation
Show context: "Teaching Assistant for CS101" when in TA section

### Phase 4: Frontend - Styling & UX

#### 1. Visual Distinction
- Color-code TA content differently from student assignments
- Use different icon (e.g., shield icon for TA section)
- Show badge "TA" next to course names in TA section

#### 2. Breadcrumbs
- Student: "My Assignments » CS101 » Assignment 1"
- TA: "Teaching Assistant » CS101 » Grading"

#### 3. Timeline/Status Display
Show the grading workflow:
- [ ] Submissions to grade
- [ ] Grading in progress
- [x] Grading completed

---

## File Structure (Summary)

### Backend Files to Modify
```
backend/app/api/routes/
├── courses.py        (Add role filtering to GET /me)
├── submissions.py    (Add GET /courses/{id}/for-grading endpoint)
└── existing files    (No changes needed - grading already supports TA role)
```

### Frontend Files to Create
```
frontend/src/
├── app/student/
│   ├── teaching-assistant/
│   │   ├── page.tsx                          (TA Dashboard)
│   │   └── [courseId]/
│   │       └── grading/
│   │           └── page.tsx                  (TA Grading Page)
│   └── page.tsx                              (Update: add TA section)
│
├── components/
│   ├── TeachingAssistantSection.tsx          (NEW - TA course cards)
│   ├── TADashboard.tsx                       (NEW - TA overview)
│   ├── TACoursesCard.tsx                     (NEW - course card for TA)
│   └── Sidebar.tsx                           (Update: add TA nav items)
│
├── hooks/queries/
│   └── useSubmissions.ts                     (Add: getSubmissionsForGrading)
│
└── services/api/
    └── submissionService.ts                  (Add: getSubmissionsForGrading method)
```

---

## Implementation Steps (Order)

### Step 1: Backend Preparation (1 hour)
1. Add role filtering to GET `/api/courses/me`
2. Add GET `/api/submissions/courses/{courseId}/for-grading`
3. Test with curl/Postman

### Step 2: Frontend Components (2 hours)
1. Create `TeachingAssistantSection.tsx`
2. Create `TADashboard.tsx`
3. Create `TACoursesCard.tsx`
4. Update Sidebar with TA navigation

### Step 3: Student Dashboard Integration (1 hour)
1. Fetch TA courses in student dashboard
2. Conditionally render TA section
3. Add styling and icons

### Step 4: TA Grading Pages (1-2 hours)
1. Create `/student/teaching-assistant/page.tsx`
2. Create `/student/teaching-assistant/[courseId]/grading/page.tsx`
3. Reuse `AssignmentGrading` component (already works)
4. Test grading flow

### Step 5: Polish & Testing (1 hour)
1. Visual styling and color scheme
2. Navigation flow testing
3. Permission testing (ensure only TA can access)

---

## Key Features to Implement

### For Montana (Student + TA)

**When logged in as student:**
```
Dashboard
├── My Assignments (as student)
│   ├── CS101 → Assignment 1 → Submit code
│   ├── CS102 → Assignment 2 → View grade
│   └── ...
│
└── Teaching Assistant              ← NEW
    ├── CS105 (TA for)
    │   ├── Assignment 1 (5 to grade)
    │   ├── Assignment 2 (3 to grade)
    │   └── Assignment 3 (Grading complete)
    │
    └── CS210 (TA for)
        ├── Assignment 1 (8 to grade)
        └── Assignment 2 (Grading complete)
```

**Grading Flow (same as faculty):**
1. Click "Teaching Assistant"
2. Select course (e.g., CS105)
3. View assignment list, select one to grade
4. See submission queue
5. Click submission → open grading interface
6. View code + test results + rubric
7. Provide feedback + score
8. Move to next submission

---

## Permission & Access Control

### What Montana CAN do as TA:
- ✅ View courses she's TA for
- ✅ View all student submissions in those courses
- ✅ Grade submissions (run tests, apply rubric, provide feedback)
- ✅ View submission history and grading results
- ✅ Export grades (if faculty allows)

### What Montana CANNOT do as TA:
- ❌ Edit course settings (only instructor can)
- ❌ Add/remove students (only instructor can)
- ❌ Delete or archive assignments (only instructor can)
- ❌ Add other TAs (only instructor can)
- ❌ View private course data not related to grading

---

## Database Queries Needed

### Query 1: Get user's TA courses
```sql
SELECT c.* FROM courses c
JOIN enrollments e ON c.id = e.course_id
WHERE e.user_id = ? AND e.role = 'ta'
```

### Query 2: Get submissions for TA grading in course
```sql
SELECT s.* FROM submissions s
JOIN assignments a ON s.assignment_id = a.id
WHERE a.course_id = ? AND s.status IN ('submitted', 'grading')
ORDER BY s.created_at;
```

---

## Expected User Experience

### 1. Montana's First Time as TA:
- Navigates to dashboard
- Sees both "My Assignments" and "Teaching Assistant" sections
- New badge/icon shows TA courses
- Clicks "Teaching Assistant" → sees CS105, CS210

### 2. Grading a Submission:
- Clicks CS105 → Assignment 1
- Sees queue: "5 submissions to grade"
- Clicks first submission
- Grading interface opens (same as faculty uses)
- Views student code, test results, rubric
- Provides feedback: "Good logic, but missing edge case handling"
- Enters score: 42/50
- Clicks "Submit Grade"
- Moves to next submission automatically

### 3. Dashboard Summary:
- Shows progress: "3 of 8 submissions graded in CS105"
- Shows progress: "Grading complete for CS210"

---

## Testing Scenarios

### Scenario 1: TA Course Access
- [ ] Montana logs in as student
- [ ] Sees "Teaching Assistant" section
- [ ] CS105 and CS210 courses listed
- [ ] Can click to view course details

### Scenario 2: Grading Submissions
- [ ] Montana accesses CS105 grading
- [ ] Sees all student submissions
- [ ] Can open submission and grade
- [ ] Permission check: she can grade (TA role)
- [ ] Grade gets saved to database

### Scenario 3: Permission Isolation
- [ ] Montana as TA can ONLY grade in CS105, CS210
- [ ] Cannot access faculty-only settings
- [ ] Cannot see courses where she's only a student in grading view

---

## Dependencies & Notes

- ✅ Backend already supports TA role in grading endpoints
- ✅ AssignmentGrading component can be reused
- ✅ GradingModal component can be reused
- ✅ Permission system already in place
- ⚠️ Need to add role filtering to course queries
- ⚠️ Need to create new TA-specific UI flows

---

## Timeline Estimate

- **Phase 1 (Backend):** 30 minutes
- **Phase 2 (Components):** 1.5 hours
- **Phase 3 (Integration):** 45 minutes
- **Phase 4 (Pages):** 1 hour
- **Phase 5 (Polish):** 30 minutes

**Total: ~4 hours**

