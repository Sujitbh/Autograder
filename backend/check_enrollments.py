from app.core.database import SessionLocal
from app.models.user import User
from app.models.course import Course
from app.models.enrollment import Enrollment

db = SessionLocal()

# Find Lon Smith
lon = db.query(User).filter(User.email == 'lon.smith@ulm.edu').first()
if not lon:
    print('Lon Smith not found')
    exit()

print(f'Lon Smith ID: {lon.id}')
print(f'Lon Smith role: {lon.role}')
print()

# Show all courses
courses = db.query(Course).all()
print('All courses:')
for c in courses:
    print(f'  Course ID {c.id}: {c.name} ({c.code})')
print()

# Show Lon's enrollments
enrollments = db.query(Enrollment).filter(Enrollment.user_id == lon.id).all()
print(f'Lon enrollments (found {len(enrollments)}):')
for e in enrollments:
    course = db.query(Course).filter(Course.id == e.course_id).first()
    print(f'  Course ID {e.course_id}: {course.name if course else "Unknown"} - Role: {e.role}')

db.close()
