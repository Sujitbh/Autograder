"""
Seed script to create initial courses for the autograder system.
"""
import sys
sys.path.insert(0, '/Users/sujitbhattarai/Desktop/Autograder/autograder/backend')

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.course import Course


def seed_courses():
    """Create sample courses."""
    db: Session = SessionLocal()

    courses_data = [
        {
            "name": "Introduction to Computer Science",
            "code": "CSCI 1010",
            "description": "Fundamental concepts of computer science including problem solving, algorithms, and basic programming in Python.",
        },
        {
            "name": "Data Structures & Algorithms",
            "code": "CSCI 2020",
            "description": "Study of fundamental data structures (arrays, linked lists, trees, graphs) and algorithm design techniques.",
        },
        {
            "name": "Operating Systems",
            "code": "CSCI 3030",
            "description": "Concepts of operating systems: processes, threads, memory management, file systems, and concurrency.",
        },
        {
            "name": "Database Management Systems",
            "code": "CSCI 3050",
            "description": "Relational database design, SQL, normalization, indexing, and transaction management.",
        },
        {
            "name": "Software Engineering",
            "code": "CSCI 4010",
            "description": "Software development life cycle, agile methodologies, version control, testing, and team collaboration.",
        },
    ]

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
