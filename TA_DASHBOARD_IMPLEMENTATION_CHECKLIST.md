# Teaching Assistant Dashboard - Implementation Checklist

## Phase 1: Backend Preparation ⚙️
- [ ] **Modify GET `/api/courses/me` endpoint**
  - File: `backend/app/api/routes/courses.py`
  - Add optional query parameter: `role` (filter by "student", "ta", or "instructor")
  - Return courses with user's role in each course
  - Test: `GET http://localhost:8000/api/courses/me?role=ta`

- [ ] **Create new endpoint: GET `/api/submissions/courses/{course_id}/for-grading`**
  - File: `backend/app/api/routes/submissions.py`
  - Check: User must be TA or instructor for the course
  - Return: All submissions for the course with student details
  - Test: `GET http://localhost:8000/api/submissions/courses/3/for-grading`

- [ ] **Verify grading endpoints support TA role** (should already work)
  - `POST /api/grading/submissions/{submission_id}/grade` ✅ Already supports TA
  - `PATCH /api/grading/submissions/{submission_id}/score` ✅ Already supports TA

---

## Phase 2: API Service Layer (Frontend) 🔌
- [ ] **Add method to courseService (`frontend/src/services/api/courseService.ts`)**
  - `getMyCoursesAsTA()` - Returns courses where user is TA
  - Uses `GET /api/courses/me?role=ta`

- [ ] **Add method to submissionService (`frontend/src/services/api/submissionService.ts`)**
  - `getSubmissionsForGrading(courseId)` - Returns submissions in a course for grading
  - Uses `GET /api/submissions/courses/{courseId}/for-grading`

- [ ] **Create/Update React Query hooks (`frontend/src/hooks/queries/`)**
  - `useTACourses()` - Hook to fetch courses where user is TA
  - `useSubmissionsForGrading(courseId)` - Hook to fetch submissions for grading

---

## Phase 3: Frontend Components Creation 🎨

### New Components to Create

- [ ] **`frontend/src/components/TeachingAssistantSection.tsx`**
  - Props: courses where user is TA
  - Shows: Course cards with instructor, pending submissions count
  - Actions: Click to grade button
  - Styling: Distinct from student courses (icon/color)

- [ ] **`frontend/src/components/TACoursesCard.tsx`**
  - Props: course info, submission count, instructor
  - Shows: Course name, code, instructor, pending submissions
  - Layout: Similar to regular course card but for TA purposes
  - Icon: Shield or TA badge

- [ ] **`frontend/src/components/TADashboardOverview.tsx`**
  - Shows: Summary of all TA responsibilities
  - Stats: Total courses, pending submissions, grading progress
  - Filter: By course
  - Action: Navigate to grading for specific course

### Components to Modify

- [ ] **`frontend/src/components/Sidebar.tsx`**
  - Add conditional "Teaching Assistant" nav item
  - Show only if user has TA courses
  - Links to TA dashboard: `href="/student/teaching-assistant"`

- [ ] **`frontend/src/app/student/page.tsx`** (Student Dashboard)
  - Fetch TA courses alongside student courses
  - Show both "My Assignments" and "Teaching Assistant" sections
  - Conditionally render TA section if courses exist

---

## Phase 4: Frontend Pages Creation 📄

- [ ] **Create `frontend/src/app/student/teaching-assistant/page.tsx`**
  - Purpose: TA Dashboard overview
  - Shows: All TA courses, assignment list with submission counts
  - Features:
    - Course selector/filter
    - Assignment list (assignments in each course)
    - Submission count badges
    - "Start Grading" button for each assignment
  - Layout: Similar to faculty dashboard

- [ ] **Create `frontend/src/app/student/teaching-assistant/[courseId]/grading/page.tsx`**
  - Purpose: Actual grading interface for a specific course
  - Component: Reuse existing `<AssignmentGrading />` component
  - Verify: User is TA for this course before rendering
  - Pass props: courseId, submissions, assignments

---

## Phase 5: Integration & Testing 🧪

### Integration Tests
- [ ] Montana (student) logs in
- [ ] Dashboard shows both "My Assignments" and "Teaching Assistant" sections
- [ ] TA section shows CS105 and CS210 courses
- [ ] Click on Teaching Assistant course → goes to `/student/teaching-assistant/[courseId]/grading`
- [ ] Grading interface loads with submission queue
- [ ] Can open a submission and edit feedback
- [ ] Grade gets saved to database
- [ ] Move to next submission works
- [ ] Close button returns to teaching assistant dashboard

### Permission Tests
- [ ] Montana can only see courses she's a TA for
- [ ] Student-only users don't see "Teaching Assistant" section
- [ ] Montana can't access TA grading for courses she's not a TA for
- [ ] Montana can't modify course settings (already prevented by faculty page)

### Edge Cases
- [ ] Montana with no TA courses → show "You're not a TA for any courses yet"
- [ ] Course with no submissions → show "No submissions yet"
- [ ] Course with completed grading → show completion status

---

## Phase 6: UI/UX Polish 🎀

- [ ] **Visual Styling**
  - Color scheme for TA section (distinct from student section)
  - Icons: Guard/shield icon for TA features
  - Badges: "TA" badge next to course names
  - Color codes: Pending (orange), In progress (blue), Complete (green)

- [ ] **Breadcrumbs**
  - `/student/` → "Dashboard"
  - `/student/teaching-assistant/` → "Teaching Assistant"
  - `/student/teaching-assistant/3/grading/` → "Teaching Assistant > CS105 > Grading"

- [ ] **Status Indicators**
  - Submission count badges
  - Grading progress bar
  - Last graded timestamp

- [ ] **Responsive Design**
  - Mobile: Stack sections vertically
  - Tablet: 2-column layout
  - Desktop: Full layout with sidebar

---

## Verification Checklist ✅

After implementation complete, verify:

- [ ] Backend endpoints respond correctly
  - [ ] `GET /api/courses/me?role=ta` returns TA courses
  - [ ] `GET /api/submissions/courses/{courseId}/for-grading` returns submissions
  
- [ ] Frontend loads without errors
  - [ ] No console errors
  - [ ] TA section renders for Montana
  - [ ] Navigation works smoothly

- [ ] Grading workflow works end-to-end
  - [ ] Montana can view submissions
  - [ ] Can open grading interface
  - [ ] Can submit grades
  - [ ] Grades appear in database

- [ ] Permissions enforced
  - [ ] Montana can grade only courses she's TA for
  - [ ] Can't access faculty-only settings
  - [ ] Non-TA users don't see TA features

- [ ] UI/UX complete
  - [ ] Montana doesn't get confused between student and TA roles
  - [ ] Clear navigation between views
  - [ ] Status indicators show progress

---

## File Checklist

### Backend Files to Modify
- [ ] `backend/app/api/routes/courses.py`
- [ ] `backend/app/api/routes/submissions.py`

### Frontend Files to Create
- [ ] `frontend/src/components/TeachingAssistantSection.tsx`
- [ ] `frontend/src/components/TACoursesCard.tsx`
- [ ] `frontend/src/components/TADashboardOverview.tsx`
- [ ] `frontend/src/app/student/teaching-assistant/page.tsx`
- [ ] `frontend/src/app/student/teaching-assistant/[courseId]/grading/page.tsx`
- [ ] `frontend/src/hooks/queries/useTACourses.ts` (if needed)

### Frontend Files to Modify
- [ ] `frontend/src/components/Sidebar.tsx`
- [ ] `frontend/src/app/student/page.tsx`
- [ ] `frontend/src/services/api/courseService.ts`
- [ ] `frontend/src/services/api/submissionService.ts`

---

## Dependencies & Prerequisites

✅ **Already Available:**
- Backend permission system (supports TA role)
- Grading service (already handles TA)
- AssignmentGrading component (reusable)
- GradingModal component (reusable)
- Submission models and APIs
- User authentication system

⚠️ **Need to Implement:**
- Role filtering in course endpoint
- New submissions endpoint for grading
- TA dashboard pages
- TA navigation components

---

## Time Estimates per Phase

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Backend endpoints | 30 min |
| 2 | API service methods & hooks | 20 min |
| 3 | Components creation | 1.5 hours |
| 4 | Pages creation | 45 min |
| 5 | Integration & testing | 45 min |
| 6 | UI/UX polish | 30 min |
| **Total** | | **~4 hours** |

---

## Quick Start Commands

```bash
# Start backend (if not running)
cd backend
python -m uvicorn app.main:app --reload

# Start frontend (if not running)
cd frontend
npm run dev

# Test endpoints with curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/courses/me?role=ta

# Run tests
cd frontend
npm test

# Build for production
npm run build
```

---

## Notes

- Montana's user.role is still "student" in the users table
- Her enrollment.role for specific courses is "ta" (stored in enrollments table)
- The grading endpoints already check enrollment.role, so no backend logic changes needed
- Can reuse 80% of existing grading UI components
- Main work is creating new pages and navigation

---

## Success Criteria

When complete, Montana should be able to:
1. ✅ Log in as a student
2. ✅ See her student assignments
3. ✅ See a separate "Teaching Assistant" section
4. ✅ Click on a TA course  
5. ✅ View all student submissions for that course
6. ✅ Open a submission in the grading interface
7. ✅ Run tests and evaluate rubric
8. ✅ Provide feedback and score
9. ✅ Submit grade (saved to database)
10. ✅ Move to next submission
11. ✅ All permissions properly enforced

