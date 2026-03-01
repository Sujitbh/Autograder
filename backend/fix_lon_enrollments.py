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

print(f'Enrolling Lon Smith (ID: {lon.id}) as instructor in all courses...')
print()

# Get all courses
courses = db.query(Course).all()

for course in courses:
    # Check if already enrolled
    existing = db.query(Enrollment).filter(
        Enrollment.course_id == course.id,
        Enrollment.user_id == lon.id
    ).first()
    
    if existing:
        if existing.role != 'instructor':
            existing.role = 'instructor'
            db.add(existing)
            print(f'✓ Updated role to instructor in: {course.name} (ID: {course.id})')
        else:
            print(f'  Already instructor in: {course.name} (ID: {course.id})')
    else:
        enrollment = Enrollment(
            course_id=course.id,
            user_id=lon.id,
            role='instructor'
        )
        db.add(enrollment)
        print(f'+ Added as instructor in: {course.name} (ID: {course.id})')

db.commit()
print()
print('Done! Lon Smith is now instructor in all courses.')
db.close()
