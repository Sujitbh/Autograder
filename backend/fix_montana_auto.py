#!/usr/bin/env python3
"""
Auto-fix Montana's duplicate enrollment: keep Principle of Software Engineering, remove CSCI 3020
"""

import sys
sys.path.insert(0, '.')

from app.core.database import SessionLocal
from app.models.user import User
from app.models.enrollment import Enrollment
from app.models.course import Course

db = SessionLocal()

try:
    # Find Montana
    montana = db.query(User).filter(User.name.ilike('%montana%')).first()
    
    if not montana:
        print("❌ User 'Montana' not found")
        sys.exit(1)
    
    # Get all her enrollments
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == montana.id).all()
    
    print(f"✅ Found: {montana.name} ({montana.email})")
    print(f"📋 Current enrollments:")
    
    for e in enrollments:
        course = db.query(Course).filter(Course.id == e.course_id).first()
        print(f"   • {course.name} ({course.code})")
    
    # Find and remove CSCI 3020 (ss) enrollment, keep Principle of Software Engineering
    for e in enrollments:
        course = db.query(Course).filter(Course.id == e.course_id).first()
        if course.code == "ss" or "3020" in course.name:
            db.delete(e)
            db.commit()
            print(f"\n❌ Removed erroneous enrollment from: {course.name}")
    
    # Show final state
    remaining = db.query(Enrollment).filter(Enrollment.user_id == montana.id).all()
    print(f"\n✅ Fixed! Montana is now enrolled in {len(remaining)} course(s):")
    for e in remaining:
        course = db.query(Course).filter(Course.id == e.course_id).first()
        print(f"   • {course.name} ({course.code})")

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
    sys.exit(1)
finally:
    db.close()
