"""
Seed script to create initial courses for the autograder system.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.course import Course


def seed_courses():
    """Create sample courses."""
    db: Session = SessionLocal()

    # No default courses — start completely empty
    courses_data = []

    try:
        created = 0
        skipped = 0
        for c in courses_data:
            existing = db.query(Course).filter(Course.code == c["code"]).first()
            if existing:
                print(f"⚠️  Course {c['code']} already exists. Skipping...")
                skipped += 1
            else:
                course = Course(**c)
                db.add(course)
                db.commit()
                db.refresh(course)
                print(f"✅ Created: {c['code']} — {c['name']}")
                created += 1

        print(f"\n{'='*50}")
        print(f"SEED SUMMARY: {created} created, {skipped} skipped")
        print(f"{'='*50}")

    except Exception as e:
        print(f"❌ Error seeding courses: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🔧 Seeding courses...\n")
    seed_courses()
    print("\n✨ Done!")
