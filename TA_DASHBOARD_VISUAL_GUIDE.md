# TA Dashboard - Visual UI Guide

## 1. Student Dashboard (Updated)

```
┌─────────────────────────────────────────────┐
│ TopNav: Dashboard    [Profile] [Logout]     │
├─────────────────────────────────────────────┤
│ 🏔️ Welcome back, Montana!                    │
├─────────────────────────────────────────────┤
│
│ MY ASSIGNMENTS
│ ┌──────────────┐  ┌──────────────┐
│ │ CS 101       │  │ MATH 201     │
│ │ Introduction │  │ Calculus II  │
│ │ Programming  │  │              │
│ └──────────────┘  └──────────────┘
│
│ TA INVITATIONS
│ [You've been invited to be a TA for CS 105]
│
│ TEACHING ASSISTANT          ← NEW SECTION!
│ ┌─────────────────────────────────────────┐
│ │ 🛡️ CS 105                               │
│ │ Introduction to Programming            │
│ │ Dr. Johnson                            │
│ │ [Grade Submissions]                    │
│ └─────────────────────────────────────────┘
│ ┌─────────────────────────────────────────┐
│ │ 🛡️ CS 210                               │
│ │ Data Structures                        │
│ │ Dr. Smith                              │
│ │ [Grade Submissions]                    │
│ └─────────────────────────────────────────┘
│
└─────────────────────────────────────────────┘
```

---

## 2. TA Dashboard Overview Page
**URL:** `/student/teaching-assistant`

```
┌─────────────────────────────────────────────┐
│ TopNav: Dashboard > Teaching Assistant      │
├─────────────────────────────────────────────┤
│ Sidebar: [TA Dashboard selected]            │
├──────────────────────────────────────────┬──┤
│                                          │  │
│ 🛡️ TEACHING ASSISTANT DASHBOARD          │  │
│                                          │  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │
│ │⏳         │ │⏱️         │ │✅        │  │  │
│ │ Pending  │ │ In       │ │Completed│  │  │
│ │ 12       │ │ Progress │ │ 28      │  │  │
│ │          │ │ 5        │ │         │  │  │
│ └──────────┘ └──────────┘ └──────────┘  │  │
│                                          │  │
│ Filter by course: [CS 105 ▼]             │  │
│                                          │  │
│ ┌────────────────────────────┐          │  │
│ │ CS 105                     │          │  │
│ │ Introduction to Programming│          │  │
│ │ Pending: 8 submissions     │          │  │
│ │ [Grade Submissions]        │          │  │
│ └────────────────────────────┘          │  │
│ ┌────────────────────────────┐          │  │
│ │ CS 210                     │          │  │
│ │ Data Structures            │          │  │
│ │ Pending: 4 submissions     │          │  │
│ │ [Grade Submissions]        │          │  │
│ └────────────────────────────┘          │  │
│                                          │  │
└──────────────────────────────────────────┴──┘
```

---

## 3. TA Course Grading Page
**URL:** `/student/teaching-assistant/[courseId]/grading`

```
┌─────────────────────────────────────────────┐
│TopNav: Dashboard > TA > CS 105 > Grading   │
├─────────────────────────────────────────────┤
│ Sidebar: [Grading selected]                 │
├──────────────────────────────────────────┬──┤
│                                          │  │
│ CS 105 - ASSIGNMENTS TO GRADE            │  │
│                                          │  │
│ ┌────────────────────────────┐           │  │
│ │ Hello World Program        │           │  │
│ │ 📤 5 Pending | ✅ 3 Graded │           │  │
│ │ [Grade Submissions]        │           │  │
│ └────────────────────────────┘           │  │
│                                          │  │
│ ┌────────────────────────────┐           │  │
│ │ Calculator Project         │           │  │
│ │ 📤 2 Pending | ✅ 6 Graded │           │  │
│ │ [Grade Submissions]        │           │  │
│ └────────────────────────────┘           │  │
│                                          │  │
│ ┌────────────────────────────┐           │  │
│ │ Final Project              │           │  │
│ │ 📤 0 Pending | ✅ 8 Graded │           │  │
│ │ [Grade Submissions]        │           │  │
│ └────────────────────────────┘           │  │
│                                          │  │
└──────────────────────────────────────────┴──┘
```

---

## 4. Assignment Grading Page (Existing - Reused)
**URL:** `/courses/[courseId]/assignments/[assignmentId]/grading`

```
┌─────────────────────────────────────────────┐
│ TopNav: [...CS 105 > Assignments > Grading] │
├─────────────────────────────────────────────┤
│ Sidebar: [Grading selected]                 │
├──────────────────────────────────────────┬──┤
│                                          │  │
│ HELLO WORLD PROGRAM - GRADE SUBMISSIONS  │  │
│ 5 submissions to grade                   │  │
│                                          │  │
│ ┌────────────────────────────────────┐  │  │
│ │ John Smith (john@school.edu)       │  │  │
│ │ Submitted: 2024-01-15 14:32        │  │  │
│ │ Status: Pending                    │  │  │
│ │ [View Code] [Run Tests] [Grade]    │  │  │
│ └────────────────────────────────────┘  │  │
│                                          │  │
│ ┌────────────────────────────────────┐  │  │
│ │ Jane Doe (jane@school.edu)         │  │  │
│ │ Submitted: 2024-01-15 09:15        │  │  │
│ │ Status: In Progress                │  │  │
│ │ [View Code] [Run Tests] [Grade]    │  │  │
│ └────────────────────────────────────┘  │  │
│                                          │  │
│ ... more submissions ...                 │  │
│                                          │  │
└──────────────────────────────────────────┴──┘
```

---

## Component Structure Diagram

```
┌─ StudentDashboard (existing)
│  ├─ MyAssignmentsSection (existing)
│  ├─ TAInvitationsSection (existing)
│  └─ TeachingAssistantSection (NEW!)
│     ├─ TA Badge 🛡️
│     ├─ Course Cards (3 columns)
│     │  ├─ Course Name
│     │  ├─ Course Code
│     │  ├─ Description
│     │  └─ [Grade Submissions] Button
│     └─ Empty State (if no TA courses)
│
├─ TA Dashboard Page
│  ├─ TopNav with Breadcrumbs
│  ├─ Sidebar
│  └─ TADashboardOverview (NEW!)
│     ├─ Stats Section
│     │  ├─ StatCard: Pending (🔴)
│     │  ├─ StatCard: In Progress (🟡)
│     │  ├─ StatCard: Completed (🟢)
│     │  └─ StatCard: Total
│     ├─ Filter Dropdown
│     └─ Course Cards Grid
│        └─ Shows pending count per course
│
├─ TA Grading Page
│  ├─ TopNav with Breadcrumbs
│  ├─ Sidebar
│  └─ Assignment Grid
│     ├─ Assignment Card (per assignment)
│     │  ├─ Assignment Name
│     │  ├─ Status Badges
│     │  │  ├─ 📤 X Pending (yellow)
│     │  │  └─ ✅ X Graded (green)
│     │  └─ [Grade Submissions] Button
│     └─ Links to AssignmentGrading (existing)
│
└─ AssignmentGrading (existing - reused)
   ├─ Submission List
   ├─ Code Viewer
   ├─ Test Runner
   ├─ Rubric Evaluator
   └─ Grade Submission Form
```

---

## Data Flow Diagram

```
USER INTERACTIONS:
Montana Avatar
    ↓
Student Dashboard (loads)
    ├─ useMyCourses() → ['courses', 'student']
    └─ useTACourses() → ['courses', 'ta']  (NEW)
    ↓
[Sees TA courses] → Clicks "Grade Submissions"
    ↓
TA Dashboard Page (loads)
    ├─ useTACourses() → Get all TA courses
    └─ useSubmissionsForGrading(courseId?) → Get count stats
    ↓
[Selects course from dropdown] → States change
    ├─ selectedCourseId = courseId
    └─ useSubmissionsForGrading(selectedCourseId) → Re-fetch
    ↓
[Clicks course card] → Router.push(`/student/teaching-assistant/${courseId}/grading`)
    ↓
TA Grading Page (loads)
    ├─ useCourse(courseId) → Get course details
    └─ useSubmissionsForGrading(courseId) → Get all submissions
    ↓
[Groups by assignment in useMemo]
    ├─ submissionsByAssignment[assignmentId] = [submissions...]
    └─ Displays assignment cards with counts
    ↓
[Clicks assignment] → Router.push(`/courses/${courseId}/assignments/${assignmentId}/grading`)
    ↓
AssignmentGrading Component (existing)
    └─ Shows list of submissions to grade (already supports TA role!)
```

---

## API Call Flow

```
STUDENT DASHBOARD
│
├─ GET /api/courses/me                    (Get student courses)
│  └─ Response: Course[] (role=student)
│
└─ GET /api/courses/me?role=ta            (NEW!) Get TA courses
   └─ Response: Course[] (role=ta)
      ├─ id: 3
      ├─ name: "CS 105"
      ├─ code: "CS105"
      ├─ description: "Intro to Programming"
      └─ ...

TA DASHBOARD PAGE
│
├─ GET /api/courses/me?role=ta            (Get all TA courses)
│  └─ Response: Course[]
│
└─ GET /api/submissions/courses/{courseId}/for-grading  (NEW!)
   └─ Response: Submission[]
      ├─ [Grouped by assignment_id]
      ├─ id: 123
      ├─ assignment_id: 5
      ├─ student: { name: "John Smith", email: "john@school.edu" }
      ├─ status: "pending"
      ├─ files: [{ name: "main.py", path: "..." }]
      └─ ...

TA GRADING PAGE
│
├─ GET /api/courses/{courseId}             (Get course name for header)
│  └─ Response: Course { id: 3, name: "CS 105", ... }
│
└─ GET /api/submissions/courses/{courseId}/for-grading
   └─ Response: All submissions grouped by assignment_id
      ├─ assignmentId 5:
      │  ├─ Submission { id: 123, ... } (pending)
      │  ├─ Submission { id: 124, ... } (pending)
      │  └─ Submission { id: 125, ... } (graded)
      │
      └─ assignmentId 6:
         ├─ Submission { id: 200, ... } (pending)
         └─ Submission { id: 201, ... } (graded)

ASSIGNMENT GRADING (existing flow)
│
└─ GET /api/submisions/courses/{courseId}/assignments/{assignmentId}/grading
```

---

## UI State Management

```
StudentDashboard
├─ taCourses: Course[]           (from useTACourses)
├─ isLoadingTACourses: boolean
└─ onSelectCourse → (courseId: string) => router.push(...)

TADashboardPage
├─ taCourses: Course[]           (from useTACourses)
├─ selectedCourseId: number | null (useState)
├─ submissions: Submission[]     (from useSubmissionsForGrading(selectedCourseId))
├─ pendingCount: number
├─ inProgressCount: number
├─ completedCount: number
└─ onSelectCourse → (courseId: number) => setSelectedCourseId(courseId)

TAGradingPage
├─ courseId: string              (from URL params)
├─ course: Course                (from useCourse)
├─ submissions: Submission[]     (from useSubmissionsForGrading)
├─ submissionsByAssignment: Map<assignmentId, Submission[]> (from useMemo)
└─ onSelectAssignment → router.push to AssignmentGrading
```

---

## Styling System

### Colors Used:

**From Theme Context (CSS Variables):**
```css
--color-text-dark        /* Primary text - #1a1a1a */
--color-text-mid         /* Secondary text - #666 */
--color-surface          /* Card background - #fff */
--color-border           /* Borders - #ddd */
--color-primary          /* Links/buttons - #1967d2 */
--color-primary-light    /* Hover - #1557b0 */
```

**Custom Colors (TeachingAssistant Components):**
```
TA Badge:
  bg: #e8f0fe (light blue)
  text: #1967d2 (dark blue)
  
Pending Stat: #EA4335 (red)
In Progress Stat: #FBBC04 (yellow)  
Completed Stat: #34A853 (green)

Button Primary:
  bg: #1967d2
  hover: #1557b0
  
Button Ghost:
  bg: transparent
  border: 1px #ddd
```

### Layout Grid:

```
Responsive Breakpoints:
├─ Mobile (<640px): 1 column
├─ Tablet (640-1024px): 2 columns
└─ Desktop (>1024px): 3 columns

Spacing:
├─ Card gap: 24px (grid-gap: 1.5rem)
├─ Section margin: 48px bottom (mb-12)
├─ Internal padding: 24px (p-6)
└─ Border radius: 8px (rounded-lg)
```

---

## Permission & Authentication

```
All pages protected by AuthGuard:
├─ Must be logged in
└─ Must have valid session

API Endpoint Permission Checks:

GET /courses/me?role=ta
├─ Backend: Verifies current_user exists
└─ Returns only enrollments where user.id == enrollment.user_id AND enrollment.role == 'ta'

GET /submissions/courses/{courseId}/for-grading
├─ Backend: require_course_role(courseId, ['ta', 'instructor'])
├─ Returns 403 if user is not TA or Instructor for course
└─ Returns 404 if course doesn't exist
```

---

## Testing Scenarios

### ✅ Montana (TA Account)
```
1. Login as montana@test.com
2. See TA section on dashboard with CS 105, CS 210
3. Click "Grade Submissions" on CS 105
4. See TA Dashboard with stats (8 pending, 4 in progress, 3 completed)
5. Click "Grade Submissions" on course card
6. See CS 105 assignments:
   - Hell World (5 pending, 3 graded)
   - Calculator (2 pending, 6 graded)
   - Final (0 pending, 8 graded)
7. Click "Grade Submissions" on Hello World
8. See list of 5 pending submissions
9. Click submission to grade
10. View code, run tests, enter grade ✅
```

### ✅ John (Student Only)
```
1. Login as john@school.edu
2. See MY ASSIGNMENTS section
3. NO TEACHING ASSISTANT section
4. Cannot access /student/teaching-assistant routes
```

### ✅ Dr. Smith (Instructor)
```
1. Login as drsmith@university.edu
2. Navigate to faculty dashboard (different from student)
3. Can see all courses teach and manage
4. Can view grading from faculty interface ✅
```

---

## Performance Metrics

**Queries & Caching:**
```
Query Key                                    Cache Time
─────────────────────────────────────────    ──────────
['courses', 'ta']                            5 minutes
['courses', 'student']                       5 minutes
['submissions-for-grading', courseId]       1 minute
['course', courseId]                         5 minutes
['submissions', courseId]                    1 minute
```

**Rendered Elements:**
```
Student Dashboard:
├─ 1-3 TA course cards (efficient)
└─ ~200kb total JS

TA Dashboard:
├─ 4 stat cards
├─ 1 dropdown
└─ 2-10 course cards
└─ ~300kb total JS

TA Grading Page:
├─ 1-10 assignment cards
└─ ~250kb total JS
```

---

## Summary

The complete TA experience is now built into the student dashboard with:
- ✅ Seamless integration with existing UI/UX
- ✅ Role-based filtering (no teaching assistant section if not a TA)
- ✅ Multi-level navigation (Dashboard → Courses → Assignments → Grading)
- ✅ Reuse of existing grading components
- ✅ Full permission checking at API level
- ✅ Responsive mobile-friendly design
