#!/usr/bin/env python3
"""
Script to fix Montana's duplicate course enrollments.
Removes enrollments from courses she wasn't manually added to.
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
        print("❌ User 'Montana' not found in database")
        sys.exit(1)
    
    print(f"✅ Found user: {montana.name} ({montana.email})")
    
    # Get all her enrollments
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == montana.id).all()
    
    print(f"\n📋 Current enrollments ({len(enrollments)} total):")
    for e in enrollments:
        course = db.query(Course).filter(Course.id == e.course_id).first()
        print(f"   • {course.name} ({course.code}) - Role: {e.role}")
    
    if len(enrollments) <= 1:
        print("\n✅ Montana has only 1 enrollment. No duplicates to fix.")
        sys.exit(0)
    
    # Ask which enrollment to keep
    print(f"\n⚠️  Montana is enrolled in {len(enrollments)} courses.")
    print("Which course should she stay enrolled in?")
    print("(The others will be removed)")
    print()
    
    for i, e in enumerate(enrollments, 1):
        course = db.query(Course).filter(Course.id == e.course_id).first()
        print(f"  {i}. {course.name} ({course.code})")
    
    choice = input(f"\nEnter number (1-{len(enrollments)}) or 0 to cancel: ").strip()
    
    if choice == "0" or not choice.isdigit():
        print("❌ Cancelled.")
        sys.exit(0)
    
    choice_idx = int(choice) - 1
    if not (0 <= choice_idx < len(enrollments)):
        print("❌ Invalid choice.")
        sys.exit(1)
    
    keep_enrollment = enrollments[choice_idx]
    keep_course = db.query(Course).filter(Course.id == keep_enrollment.course_id).first()
    
    # Remove other enrollments
    removed = 0
    for e in enrollments:
        if e.id != keep_enrollment.id:
            course = db.query(Course).filter(Course.id == e.course_id).first()
            db.delete(e)
            db.commit()
            print(f"❌ Removed from: {course.name}")
            removed += 1
    
    print(f"\n✅ Done! Removed {removed} enrollment(s).")
    print(f"✅ Montana is now enrolled only in: {keep_course.name}")

except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
    sys.exit(1)
finally:
    db.close()
