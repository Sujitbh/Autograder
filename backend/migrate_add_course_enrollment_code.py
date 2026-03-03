"""
Idempotent migration for course enrollment code fields.

Adds:
  - courses.enrollment_code (unique)
  - courses.enrollment_code_active (boolean, default true)
"""

import sys
<<<<<<< HEAD
sys.path.insert(0, '/Users/sujitbhattarai/Desktop/Autograder/autograder/backend')
=======
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
>>>>>>> origin/ree_update

from sqlalchemy import text
from app.core.database import engine


def run_migration() -> None:
    with engine.begin() as conn:
        conn.execute(text("""
            ALTER TABLE courses
            ADD COLUMN IF NOT EXISTS enrollment_code VARCHAR;
        """))
        conn.execute(text("""
            ALTER TABLE courses
            ADD COLUMN IF NOT EXISTS enrollment_code_active BOOLEAN NOT NULL DEFAULT TRUE;
        """))
        conn.execute(text("""
            CREATE UNIQUE INDEX IF NOT EXISTS ix_courses_enrollment_code
            ON courses (enrollment_code);
        """))
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_courses_enrollment_code_active
            ON courses (enrollment_code_active);
        """))

    print("Migration complete: courses.enrollment_code + enrollment_code_active")


if __name__ == "__main__":
    run_migration()
