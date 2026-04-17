# TA Feature Integration Checklist

## ✅ Completed

### Backend Infrastructure
- [x] TAInvitation database model created
- [x] Enrollment.role field (student/ta/instructor) implemented
- [x] TAInvitation Pydantic schemas created
- [x] TAService with 5 core methods implemented
- [x] TA API routes (4 endpoints) created
- [x] Role-based authorization in routes
- [x] Routes registered in main.py

### Frontend Infrastructure
- [x] taService.ts with 6 API methods created
- [x] TAManagement component (faculty) created
- [x] TAInvitations component (student) created
- [x] Type definitions updated (TAInvitation interfaces)

### Authentication
- [x] Role-based registration (faculty/student/admin selection)
- [x] Email validation for role detection
- [x] JWT role claims handled

---

## 🔄 In Progress / Pending

### 1. Database Migration
**Status:** REQUIRED BEFORE TESTING

Run migration (SQLAlchemy auto-creates tables on backend startup):
```bash
# Backend will auto-create ta_invitations table on startup
# Or if using Alembic, generate migration:
cd backend
alembic revision --autogenerate -m "Add TAInvitation model"
alembic upgrade head
```

**Action Items:**
- [ ] Restart backend service
- [ ] Verify ta_invitations table exists: `psql -d autograder_db -c "\dt ta_invitations"`

---

### 2. Frontend Integration - Faculty Course Page

**Location:** `src/app/courses/[courseId]/` (or equivalent course detail)

**Add to course detail/settings page:**
```tsx
import TAManagement from '@/components/TAManagement';

// Inside your course page component:
<TAManagement 
  courseId={courseId}
  enrolledStudents={enrolledStudents}
  onInvitationSent={() => {
    // Refresh data if needed
    refreshCourseData();
  }}
/>
```

**Required Props:**
- `courseId: number` - Current course ID
- `enrolledStudents: GradeEnrollment[]` - Array of enrolled students
- `onInvitationSent?: () => void` - Callback to refresh parent state

**Action Items:**
- [ ] Find course detail/settings component
- [ ] Import TAManagement component
- [ ] Add component to JSX with proper props
- [ ] Test rendering

---

### 3. Frontend Integration - Student Dashboard

**Location:** `src/app/student/` (or `/student/dashboard`)

**Add to student dashboard:**
```tsx
import TAInvitations from '@/components/TAInvitations';

// Inside your student dashboard component:
<TAInvitations 
  onAccepted={() => {
    // Refresh dashboard to show updated roles
    refreshUserData();
  }}
/>
```

**Optional Props:**
- `onAccepted?: () => void` - Callback when invitation accepted

**Action Items:**
- [ ] Find student dashboard component
- [ ] Import TAInvitations component
- [ ] Add component to prominent location (top of dashboard recommended)
- [ ] Test rendering and interaction

---

### 4. Style/Design Integration

**Check:**
- [ ] TAManagement modal styling matches existing modals
- [ ] TAInvitations card styling matches existing design
- [ ] Button colors and states are consistent
- [ ] Loading spinner used (matches design system)
- [ ] Error messages styled appropriately

**If needed:**
```tsx
// Use existing design system colors/spacing
// Import from src/styles/ or components/design-system/
import { Button } from '@/components/design-system/Button';
```

---

### 5. End-to-End Testing

**Test Scenario 1: Faculty Sends Invitation**
- [ ] Faculty logs in with @ulm.edu email
- [ ] Navigate to course (where faculty = instructor)
- [ ] TAManagement component visible
- [ ] Click "Invite as Grading Assistant"
- [ ] Select enrolled student from dropdown
- [ ] Click "Send Invitation"
- [ ] See success message
- [ ] Verify invitation appears in "Pending Invitations" list

**Test Scenario 2: Student Receives and Accepts**
- [ ] Student logs in with @warhawks.ulm.edu email
- [ ] Navigate to dashboard
- [ ] See pending invitation in TAInvitations section
- [ ] Click "Accept"
- [ ] See success message
- [ ] Verify invitation moves to "Active" section

**Test Scenario 3: TA Has Grading Permissions**
- [ ] Student (now TA) navigates to course
- [ ] Can view student submissions (check grading route access)
- [ ] Can submit grades
- [ ] Cannot modify course settings

**Test Scenario 4: Error Cases**
- [ ] [ ] Faculty tries to invite non-enrolled student → Error
- [ ] [ ] Faculty invites same student twice → Error on second attempt
- [ ] [ ] Student tries to accept another student's invitation → 403 error
- [ ] [ ] Student invites someone → Route requires faculty role

---

### 6. Database Verification

After integration, run these checks:

```bash
# 1. Connect to database
psql -U postgres -d autograder_db

# 2. Check TAInvitation table exists
\dt ta_invitations

# 3. Check column structure
\d ta_invitations

# 4. Verify enrollment role values
SELECT DISTINCT role FROM enrollments;

# 5. Test query - check TAs for a course
SELECT e.user_id, e.role FROM enrollments e 
WHERE e.course_id = 1 AND e.role = 'ta';

# 6. Check TA invitations
SELECT * FROM ta_invitations;
```

---

## 📋 Quick Reference

### Files Created/Modified

**Backend - Created:**
- `/backend/app/models/ta_invitation.py`
- `/backend/app/schemas/ta_invitation.py`
- `/backend/app/services/ta_service.py`
- `/backend/app/api/routes/ta.py`

**Backend - Modified:**
- `/backend/app/models/course.py` (added faculty_id)
- `/backend/app/models/enrollment.py` (already has role)
- `/backend/app/main.py` (registered ta router)
- `/backend/app/services/user_service.py` (added role parameter)

**Frontend - Created:**
- `/frontend/src/services/api/taService.ts`
- `/frontend/src/components/TAManagement.tsx`
- `/frontend/src/components/TAInvitations.tsx`

**Frontend - Modified:**
- `/frontend/src/types/index.ts` (added TAInvitation interfaces)
- `/frontend/src/components/SignupPage.tsx` (role selection)

---

## 🚀 Deployment Order

1. **Restart Backend** (to create ta_invitations table)
   ```bash
   # Stop and restart backend service
   # Ensure SQLAlchemy creates new table
   ```

2. **Update Faculty Course Page**
   - Add TAManagement import and component
   - Test on browser

3. **Update Student Dashboard**
   - Add TAInvitations import and component
   - Test on browser

4. **Run E2E Tests**
   - Follow test scenarios above
   - Verify role transitions in database

5. **Monitor Logs**
   - Check backend console for errors
   - Check browser console for JS errors

---

## 📞 Support Matrix

| Issue | Solution |
|-------|----------|
| ta.py route not found | Ensure `app.include_router(ta.router)` in main.py |
| TAInvitation table doesn't exist | Restart backend to trigger SQLAlchemy migration |
| Authorization denied | Check user's Enrollment.role for course |
| Component not rendering | Verify courseId and enrolledStudents props passed |
| Invitation disappears after refresh | Check localStorage session validity |
| Role doesn't update after accept | Verify respond_to_invitation updates Enrollment.role |

---

## 👥 Testing Accounts

```
Faculty:
- Email: sarah.faculty@ulm.edu (existing)
- Email: robert@ulm.edu (new test)
- Role: "faculty" on signup

Student:
- Email: teststudent@warhawks.ulm.edu (existing)
- Email: alice.student@warhawks.ulm.edu (new test)
- Role: "student" on signup

Both accounts can be created via signup page with role selection.
```

---

## ✨ Next Steps After Integration

1. **Email Notifications** - Notify student when invited
2. **TA Dashboard** - Show what courses they're TAing
3. **Activity Tracking** - Log what each TA grades
4. **Performance Metrics** - Show TA grading speed/quality
5. **Feedback System** - Faculty feedback on TA performance
