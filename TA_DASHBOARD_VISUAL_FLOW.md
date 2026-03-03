# Teaching Assistant Dashboard - Visual Flow Diagram

## User Role-Based Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│                     Montana Logs In                              │
│                    (Student + TA roles)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         ┌──────▼────────┐        ┌──────▼────────┐
         │   MY COURSES  │        │  TEACHING     │
         │   (Student)   │        │  ASSISTANT    │
         └──────┬────────┘        └──────┬────────┘
                │                        │
         ┌──────▼─────────────────────────────────┐
         │                                        │
    ┌────▼─────┐  ┌────────┐  ┌────────┐  ┌────▼──┐
    │ CS101    │  │ CS102  │  │ ...    │  │ CS105 │ (TA)
    └──────────┘  └────────┘  └────────┘  └──┬────┘
                                              │
                                    ┌─────────▼──────────┐
                                    │ Grading Dashboard  │
                                    │ for CS105          │
                                    └────────┬───────────┘
                                             │
                            ┌────────────────┼────────────────┐
                            │                │                │
                    ┌───────▼────┐  ┌───────▼────┐  ┌───────▼────┐
                    │Assignment 1 │  │Assignment 2│  │Assignment 3│
                    │(5 to grade) │  │(3 to grade)│  │(Complete)  │
                    └───────┬────┘  └────────────┘  └────────────┘
                            │
                    ┌───────▼────────────┐
                    │ Submission Queue   │
                    │ (5 submissions)    │
                    └───────┬────────────┘
                            │
                    ┌───────▼────────────┐
                    │  Click Submission  │
                    │    #1 / 5          │
                    └───────┬────────────┘
                            │
                    ┌───────▼────────────────────────────┐
                    │   Grading Interface                │
                    ├────────────────────────────────────┤
                    │ ┌────────────────────────────────┐ │
                    │ │  Code Viewer                   │ │
                    │ │  (student submission code)     │ │
                    │ └────────────────────────────────┘ │
                    │                                    │
                    │ ┌────────────────────────────────┐ │
                    │ │  Test Results                  │ │
                    │ │  ✓ Test 1 Passed               │ │
                    │ │  ✗ Test 2 Failed               │ │
                    │ └────────────────────────────────┘ │
                    │                                    │
                    │ ┌────────────────────────────────┐ │
                    │ │  Rubric Evaluation             │ │
                    │ │  Code Correctness:  [15/20]    │ │
                    │ │  Code Style:        [8/10]     │ │
                    │ │  Documentation:     [7/10]     │ │
                    │ └────────────────────────────────┘ │
                    │                                    │
                    │ ┌────────────────────────────────┐ │
                    │ │  Feedback (TA provides)        │ │
                    │ │  "Good logic, but needs        │ │
                    │ │   edge case handling"          │ │
                    │ └────────────────────────────────┘ │
                    │                                    │
                    │  Final Score: [42/50]              │
                    │  [Submit Grade] [Save Draft]       │
                    └───────┬────────────────────────────┘
                            │
                    ┌───────▼─────────────┐
                    │ Grade Submitted     │
                    │ Move to next →      │
                    └─────────────────────┘
```

---

## Page Structure Map

```
/student/
├── page.tsx
│   ├── "My Assignments" Section
│   │   └── StudentCoursesGrid (CS101, CS102, etc.)
│   │
│   └── "Teaching Assistant" Section (NEW)
│       └── TeachingAssistantSection
│           └── TACoursesCard[] (CS105, CS210, etc.)
│
└── teaching-assistant/
    ├── page.tsx (NEW - TA Dashboard/Overview)
    │   ├── Sidebar (courses where TA)
    │   ├── Main content
    │   │   ├── Course selector dropdown
    │   │   └── Assignment list with submission counts
    │   └── Quick stats (X pending, Y grading, Z complete)
    │
    └── [courseId]/
        └── grading/
            └── page.tsx (NEW - Grading interface)
                └── AssignmentGrading component (reused from faculty)
```

---

## Component Hierarchy

```
StudentDashboard (Modified)
├── HeaderSection
├── MyAssignmentsSection (Existing)
│   └── CourseCard[]
│
└── TeachingAssistantSection (NEW)
    └── TACoursesCard[]
        ├── Course info
        ├── Instructor name
        ├── Assignment count
        ├── Pending submissions count
        └── "Grade Submissions" button


TADashboard (NEW)
├── TopNav
├── Sidebar
│   └── TACoursesNav[]
│
└── MainContent
    ├── CourseSelector
    ├── AssignmentList
    │   └── AssignmentRow[]
    │       ├── Assignment name
    │       ├── Status badges
    │       └── "Start Grading" button
    │
    └── GradingProgress
        ├── Pending count
        ├── In-progress count
        └── Complete count


TAGradingPage (NEW - for [courseId]/grading)
├── TopNav (with breadcrumbs)
├── PageLayout
├── Sidebar
└── MainGradingInterface
    └── AssignmentGrading (reused component)
```

---

## API Endpoints Needed

### 1. Get User's Courses by Role
```
GET /api/courses/me?role=ta

Response:
[
  {
    "id": 1,
    "name": "Data Structures",
    "code": "CS105",
    "instructor_id": 2,
    "instructor_name": "Dr. Smith",
    "user_role": "ta",
    "semester": "Spring 2026"
  },
  {
    "id": 2,
    "name": "Databases",
    "code": "CS210",
    "instructor_id": 3,
    "instructor_name": "Dr. Johnson",
    "user_role": "ta",
    "semester": "Spring 2026"
  }
]
```

### 2. Get Submissions for TA Grading
```
GET /api/submissions/courses/{course_id}/for-grading?assignment_id=1

Response:
[
  {
    "id": 15,
    "student_id": 101,
    "student_name": "John Doe",
    "student_email": "john@ulm.edu",
    "assignment_id": 1,
    "assignment_name": "Hello World",
    "status": "submitted",
    "submitted_at": "2026-03-01T10:00:00Z",
    "late": false,
    "auto_score": 35,
    "max_score": 50,
    "manual_score": null,
    "feedback": null
  },
  {
    "id": 16,
    "student_id": 102,
    "student_name": "Jane Smith",
    ...
  }
]
```

### 3. Grade Submission (Existing - Already supports TA)
```
POST /api/grading/submissions/{submission_id}/grade
Authorization: Bearer <ta_token>

Request:
{
  "run_tests": true,
  "apply_rubric": true
}

Response:
{
  "total_score": 42,
  "max_score": 50,
  "test_results": [...],
  "rubric_evaluations": [...]
}
```

### 4. Override Submission Score (Existing - Already supports TA)
```
PATCH /api/grading/submissions/{submission_id}/score
Authorization: Bearer <ta_token>

Request:
{
  "score": 42,
  "feedback": "Good logic, but missing edge case handling"
}

Response:
{
  "id": 15,
  "student_id": 101,
  "manual_score": 42,
  "feedback": "Good logic, but missing edge case handling",
  "graded_at": "2026-03-02T10:30:00Z",
  "graded_by_id": 5
}
```

---

## Database Schema (No Changes Needed!)

Montana's enrollment records will look like:

```sql
-- Enrollment table (already has role column)
┌─────────────────────────────────────────────────┐
│ id │ user_id │ course_id │ role        │        │
├─────────────────────────────────────────────────┤
│ 1  │ 5       │ 1         │ student     │ CS101  │
│ 2  │ 5       │ 2         │ student     │ CS102  │
│ 3  │ 5       │ 3         │ ta          │ CS105  │
│ 4  │ 5       │ 4         │ ta          │ CS210  │
└─────────────────────────────────────────────────┘

No schema changes needed! The role column already supports this.
```

---

## Authentication & Permissions

### Check 1: Can Montana access TA Dashboard?
```python
# When Montana tries to access /student/teaching-assistant

if current_user.role != "student":
    # Redirect non-students
    
ta_courses = get_courses_where_user_is_ta(current_user.id)
if len(ta_courses) == 0:
    # Show message: "You're not a TA for any courses yet"
else:
    # Show TA dashboard
```

### Check 2: Can Montana grade this submission?
```python
# When Montana tries to grade submission in CS105

submission = db.query(Submission).filter_by(id=submission_id).first()
assignment = db.query(Assignment).filter_by(id=submission.assignment_id).first()

user_role = get_course_role(montana_id, assignment.course_id)

if user_role not in ["instructor", "ta"]:
    raise PermissionError("You can only grade if you're an instructor or TA")
```

Both checks are already implemented in the backend! ✅

---

## Summary

**What Montana will see:**

1. **As a Student:**
   - Dashboard with her enrolled courses
   - Can submit assignments, see grades

2. **As a TA (NEW):**
   - New "Teaching Assistant" section on dashboard
   - List of courses where she's TA
   - Click to access grading interface
   - Same grading workflow as faculty
   - Can see all submissions and provide grades

**What needs to be built:**

1. **Backend:** Add 2 new endpoints (role filtering + submissions for grading)
2. **Frontend:** Add ~3 new components + 2 new pages
3. **UI/UX:** New navigation and styling for TA features

**Existing infrastructure that we can reuse:**

- ✅ Permission system (already supports TA role)
- ✅ Grading service (already accepts TA role)
- ✅ AssignmentGrading component (already works)
- ✅ GradingModal component (already works)
- ✅ Test execution (already works)
- ✅ Rubric evaluation (already works)

