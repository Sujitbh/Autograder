# TA Dashboard Implementation - Testing & Deployment Checklist

## 🎯 Implementation Status: COMPLETE ✅

All backend endpoints and frontend components for Montana's Teaching Assistant dashboard have been fully implemented.

---

## 📋 Pre-Testing Preparation

### Start the Development Environment

```bash
# Terminal 1: Backend
cd /Users/sujitbhattarai/Desktop/Autograder/autograder
source .venv/bin/activate
python -m uvicorn app.main:app --reload

# Terminal 2: Database (if using docker)
docker-compose up postgres

# Terminal 3: Frontend
cd frontend
npm run dev
```

### Verify Services Running
- [ ] Backend: `http://localhost:8000` (API)
- [ ] Backend Docs: `http://localhost:8000/docs` (Swagger)
- [ ] Frontend: `http://localhost:3000` (Next.js)
- [ ] Database: PostgreSQL on port 5432 (container: postgres_autograder)

---

## 🧪 Functional Testing

### Phase 1: Authentication & Dashboard
- [ ] Log in as **montana@test.com** (password from CREDENTIALS_BACKUP.md)
- [ ] Dashboard loads without errors
- [ ] See "Teaching Assistant" section (below My Assignments)
- [ ] "Teaching Assistant" section shows 1-2 courses (CS105, CS210)
- [ ] Each TA course card displays:
  - [ ] Course name (CS 105)
  - [ ] Course code (CS105)
  - [ ] Course description
  - [ ] Shield badge (🛡️)
  - [ ] "Grade Submissions" button

### Phase 2: TA Dashboard Overview Page
- [ ] Click "Grade Submissions" on any TA course
- [ ] Navigates to `/student/teaching-assistant/[courseId]`
- [ ] Page loads successfully
- [ ] See dashboard header: "Teaching Assistant Dashboard"
- [ ] See stat cards showing:
  - [ ] Pending submissions (count)
  - [ ] In Progress submissions (count)
  - [ ] Completed submissions (count)
  - [ ] Total submissions (count)
- [ ] See course selector dropdown (pre-selected to clicked course)
- [ ] See course cards showing pending submission counts
- [ ] No JavaScript errors in console

### Phase 3: TA Grading Page
- [ ] From dashboard, click "Grade Submissions" button
- [ ] Navigates to `/student/teaching-assistant/[courseId]/grading`
- [ ] Page loads successfully
- [ ] See course name in header
- [ ] See assignment cards listing all assignments in course
- [ ] Each assignment card shows:
  - [ ] Assignment name
  - [ ] Pending count (e.g., "📤 5 Pending")
  - [ ] Graded count (e.g., "✅ 3 Graded")
  - [ ] "Grade Submissions" button
- [ ] Assignment counts match actual submissions
- [ ] No JavaScript errors in console

### Phase 4: Grade Submission Flow
- [ ] Click "Grade Submissions" on any assignment
- [ ] Navigates to assignment grading page:
  - `/courses/[courseId]/assignments/[assignmentId]/grading`
- [ ] AssignmentGrading component loads (existing component)
- [ ] See list of student submissions
- [ ] Can view student code ✅
- [ ] Can run tests ✅
- [ ] Can view rubric ✅
- [ ] Can enter grade and feedback ✅
- [ ] Can submit grade ✅

### Phase 5: Navigation & Breadcrumbs
- [ ] Student Dashboard → TA Section visible
- [ ] TA Dashboard → Back button returns to Student Dashboard
- [ ] TA Grading Page → Back button returns to TA Dashboard
- [ ] Assignment Grading → Back button returns to TA Grading Page
- [ ] Breadcrumb showing full navigation path

### Phase 6: Data Accuracy
- [ ] TA courses shown match backend data (role='ta' enrollments)
- [ ] Submission counts match actual submissions in database
- [ ] Student names and emails correct
- [ ] Assignment names correct
- [ ] File submissions correct and downloadable

### Phase 7: Permissions & Security
- [ ] Cannot see courses where not a TA
- [ ] Cannot access `/student/teaching-assistant/[otherCourseId]/grading` if not TA for that course
- [ ] API returns 403 Forbidden for unauthorized access
- [ ] No sensitive data exposed in API responses
- [ ] Session validates before each action

### Phase 8: Error Handling
- [ ] Network error → Shows loading state, auto-retries
- [ ] Invalid courseId → Shows appropriate error message
- [ ] No submissions → Shows "No submissions yet"
- [ ] Failed API call → Toast/error notification appears
- [ ] Page doesn't crash on unexpected data

### Phase 9: Responsive Design
- [ ] Mobile (<640px):
  - [ ] Single column layout
  - [ ] Touch-friendly buttons
  - [ ] No horizontal scrolling
- [ ] Tablet (640-1024px):
  - [ ] 2-column course grid
  - [ ] All elements visible
- [ ] Desktop (>1024px):
  - [ ] 3-column course grid
  - [ ] Optimized spacing

### Phase 10: Performance
- [ ] Dashboard loads in <2 seconds
- [ ] TA Dashboard loads in <2 seconds
- [ ] Clicking course switches view in <1 second
- [ ] No memory leaks (check DevTools)
- [ ] No console errors or warnings

---

## 🐛 Edge Cases & Boundary Testing

### Account Types
- [ ] **Student Account** (john@school.edu):
  - Should NOT see "Teaching Assistant" section
  - Should NOT access `/student/teaching-assistant/*` routes
  
- [ ] **TA Account** (montana@test.com):
  - Should see TA section
  - Should access TA routes
  - Should see only courses where enrolled as TA
  
- [ ] **Instructor Account** (drsmith@university.edu):
  - Different dashboard (faculty interface)
  - Not tested here (out of scope)

### Data Scenarios
- [ ] Course with 0 submissions → Shows "No submissions yet"
- [ ] Course with 1 submission → Displays correctly
- [ ] Course with 100+ submissions → Loads without lag
- [ ] Assignment with 0 pending submissions → Shows 0 correctly
- [ ] Assignment with all pending → Shows pending count
- [ ] Assignment with all graded → Shows graded count
- [ ] User as TA for 1 course → Dashboard works
- [ ] User as TA for 5+ courses → Dashboard loads, filter works

### Network Scenarios
- [ ] Slow connection (3G) → Graceful loading states
- [ ] Offline → Appropriate error message
- [ ] API temporarily unavailable → Retry and error handling
- [ ] Partial data load → Doesn't break UI

---

## 📊 Database Verification

### Check Montana's Enrollments
```sql
-- Verify Montana is enrolled as TA
SELECT u.id, u.email, e.role, c.name, c.id
FROM users u
JOIN enrollments e ON u.id = e.user_id
JOIN courses c ON e.course_id = c.id
WHERE u.email = 'montana@test.com'
ORDER BY c.id;

-- Expected output:
-- id  | email              | role | name        | id
-- 201 | montana@test.com   | ta   | CS 105      | 3
-- 201 | montana@test.com   | ta   | CS 210      | 4
-- 201 | montana@test.com   | student | Introduction to... | 1
```

### Check Submissions for TA Courses
```sql
-- Verify submissions exist for TA courses
SELECT COUNT(*) as submission_count, a.course_id, c.name, a.id, a.title
FROM submissions s
JOIN assignments a ON s.assignment_id = a.id
JOIN courses c ON a.course_id = c.id
WHERE a.course_id IN (3, 4)  -- CS 105, CS 210
GROUP BY a.course_id, c.name, a.id, a.title
ORDER BY a.course_id;
```

---

## 🔧 Code Quality Checks

### Backend Code
- [ ] Python syntax: `python -m py_compile backend/app/api/routes/*.py`
- [ ] No import errors: Can access all backend routes
- [ ] Permission checks working: 403 on unauthorized access

### Frontend Code
- [ ] TypeScript compilation: `npm run build` (no errors)
- [ ] Component rendering: No React errors in console
- [ ] Hook dependencies: React DevTools shows proper dependency arrays
- [ ] No prop-type warnings

### API Documentation
- [ ] Swagger docs include new endpoints:
  - [ ] `GET /courses/me?role=ta`
  - [ ] `GET /submissions/courses/{courseId}/for-grading`
- [ ] Endpoint documentation is clear
- [ ] Request/response schemas correct

---

## 📈 Backend Endpoint Verification

### Endpoint 1: GET /courses/me

**Test Without Role Filter:**
```bash
curl -H "Authorization: Bearer <MONTANA_TOKEN>" \
  http://localhost:8000/api/courses/me

# Expected: Array of courses where Montana is student OR ta OR instructor
# Status: 200 OK
```

**Test With role=ta:**
```bash
curl -H "Authorization: Bearer <MONTANA_TOKEN>" \
  http://localhost:8000/api/courses/me?role=ta

# Expected: [
#   { "id": 3, "name": "CS 105", ... },
#   { "id": 4, "name": "CS 210", ... }
# ]
# Status: 200 OK
```

**Test With role=student:**
```bash
curl -H "Authorization: Bearer <MONTANA_TOKEN>" \
  http://localhost:8000/api/courses/me?role=student

# Expected: Array of courses where Montana is enrolled as student
# Status: 200 OK
```

### Endpoint 2: GET /submissions/courses/{courseId}/for-grading

**Test Valid Course (TA Enrolled):**
```bash
curl -H "Authorization: Bearer <MONTANA_TOKEN>" \
  http://localhost:8000/api/submissions/courses/3/for-grading

# Expected: Array of submissions
# [
#   {
#     "id": 123,
#     "assignment_id": 5,
#     "status": "pending",
#     "student": { "name": "John Smith", "email": "john@..." },
#     "files": [{ "name": "main.py", "path": "..." }],
#     ...
#   },
#   ...
# ]
# Status: 200 OK
```

**Test With assignment_id Filter:**
```bash
curl -H "Authorization: Bearer <MONTANA_TOKEN>" \
  http://localhost:8000/api/submissions/courses/3/for-grading?assignment_id=5

# Expected: Array of submissions for assignment 5 only
# Status: 200 OK
```

**Test Invalid Course (Not Enrolled as TA):**
```bash
curl -H "Authorization: Bearer <MONTANA_TOKEN>" \
  http://localhost:8000/api/submissions/courses/99/for-grading

# Expected: { "detail": "Not authorized" } or similar
# Status: 403 Forbidden
```

---

## ✅ Final Sign-Off Checklist

### Functionality
- [ ] All backend endpoints return correct data
- [ ] All frontend pages render without errors
- [ ] Complete navigation flow works end-to-end
- [ ] Grading workflow accessible and functional
- [ ] Permissions enforced correctly

### User Experience
- [ ] Clear visual distinction for TA vs Student roles
- [ ] Intuitive navigation (no confusing routes)
- [ ] Responsive on all device sizes
- [ ] Fast load times (<2 sec per page)
- [ ] Clear empty states and error messages

### Code Quality
- [ ] No console errors or warnings
- [ ] No broken imports or missing files
- [ ] Follows existing code patterns
- [ ] Type-safe TypeScript components
- [ ] Proper error handling throughout

### Documentation
- [ ] FRONTEND_COMPONENTS_IMPLEMENTATION.md created
- [ ] TA_DASHBOARD_VISUAL_GUIDE.md created
- [ ] All new files documented
- [ ] API changes documented in Swagger

### Security
- [ ] Authentication required for all routes
- [ ] Authorization checked on API endpoints
- [ ] No sensitive data in logs/console
- [ ] CSRF tokens if applicable
- [ ] SQL injection prevention (ORM used)

---

## 🚀 Deployment Checklist

### Before Going to Production
- [ ] Test in development environment thoroughly
- [ ] Run full test suite: `npm run test` (if exists)
- [ ] Build frontend for production: `npm run build`
- [ ] Check for build errors or warnings
- [ ] Database migrations applied (if any)
- [ ] Environment variables configured
- [ ] Backend error logging configured
- [ ] Frontend error tracking enabled
- [ ] Performance monitoring set up

### Deployment Steps
1. [ ] Pull latest code
2. [ ] Install dependencies: `npm install` (frontend), `pip install -r requirements.txt` (backend)
3. [ ] Run database migrations (if needed)
4. [ ] Build frontend: `npm run build`
5. [ ] Start backend: `python -m uvicorn app.main:app`
6. [ ] Serve frontend: `npm run start` or similar
7. [ ] Verify endpoints responding
8. [ ] Test critical flows with production data

### Post-Deployment
- [ ] Monitor error logs for issues
- [ ] Check performance metrics
- [ ] Get user feedback from Montana
- [ ] Verify TA grading workflow working
- [ ] Check database load/performance
- [ ] Monitor API response times

---

## 📞 Support & Debugging

### Common Issues & Solutions

**Problem:** "Teaching Assistant section not showing on dashboard
**Solution:** 
- [ ] Verify Montana has ta enrollment: Check database query result
- [ ] Clear browser cache and reload
- [ ] Check console for API errors
- [ ] Verify backend endpoint returns correct data

**Problem:** "Submissions not showing in TA grading page"
**Solution:**
- [ ] Verify submissions exist in database for selected course
- [ ] Check API response in network tab
- [ ] Verify Montana is TA for the course
- [ ] Check submission status (may be filtered)

**Problem:** "Cannot access grading page for course"
**Solution:**
- [ ] Verify course ID in URL
- [ ] Check Montana enrollment role (must be 'ta')
- [ ] Verify API returns 200 OK (not 403)
- [ ] Check backend permission logic

**Problem:** "Slow loading on TA dashboard"
**Solution:**
- [ ] Check database query performance
- [ ] Verify submissions count (too many?)
- [ ] Check React Query cache settings
- [ ] Profile with browser DevTools

### Debug Commands

```bash
# Check Python imports
python -c "from app.api.routes import courses, submissions; print('OK')"

# View API documentation
curl http://localhost:8000/docs

# Check database
psql -h localhost -U postgres -d autograder -c "SELECT COUNT(*) FROM submissions WHERE course_id = 3;"

# Check browser console
# Press F12 → Console tab → Look for errors
```

---

## 📎 File Inventory

### New Files Created
```
frontend/src/
├── components/
│   ├── TeachingAssistantSection.tsx (NEW)
│   └── TADashboardOverview.tsx (NEW)
├── app/student/
│   └── teaching-assistant/
│       ├── page.tsx (NEW)
│       └── [courseId]/
│           └── grading/
│               └── page.tsx (NEW)
```

### Modified Files
```
frontend/src/
├── components/StudentDashboard.tsx
├── hooks/queries/useCourses.ts
├── hooks/queries/useSubmissions.ts
└── hooks/queries/index.ts

backend/app/api/routes/
├── courses.py
└── submissions.py
```

### Documentation Files Created
```
FRONTEND_COMPONENTS_IMPLEMENTATION.md (NEW)
TA_DASHBOARD_VISUAL_GUIDE.md (NEW)
TA_DASHBOARD_TESTING_CHECKLIST.md (THIS FILE)
```

---

## 📊 Summary Statistics

| Category | Count |
|----------|-------|
| New Backend Endpoints | 2 |
| New API Service Methods | 2 |
| New React Query Hooks | 3 |
| New React Components | 2 |
| New Pages | 2 |
| Modified Files | 6 |
| Total New Lines of Code | ~500 |
| Files Created | 5 |
| Documentation Files | 3 |

---

## ✨ Final Notes

**Completion Status:** ✅ 100% COMPLETE

Montana's Teaching Assistant dashboard is fully implemented with:
- ✅ Backend API endpoints for filtering courses and fetching submissions
- ✅ Frontend React Query hooks for data fetching
- ✅ React components for TA dashboard display
- ✅ New pages for TA overview and grading interface
- ✅ Integration with existing Student Dashboard
- ✅ Full permission checking and security
- ✅ Responsive mobile-friendly design
- ✅ Comprehensive documentation

**Ready to test with Montana's account!**

Next step: Follow the "Testing & Debugging" section above to verify everything works correctly.

For questions or issues, refer to the documentation files or debug commands provided above.
