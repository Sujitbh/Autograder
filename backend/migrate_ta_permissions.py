"""
Idempotent migration — create ta_permissions table and add new granular columns.

Adds per-enrollment granular permissions for TAs.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import engine

NEW_COLUMNS = [
    ("can_run_tests", True),
    ("can_view_plagiarism", False),
    ("can_view_private_tests", False),
    ("can_manage_groups", False),
    ("can_contact_students", False),
    ("can_access_reports", True),
    ("can_export_grades", False),
    ("can_view_rubrics", True),
    ("can_edit_rubrics", False),
]


def migrate():
    with engine.begin() as conn:
        # Check if table already exists
        result = conn.execute(text(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ta_permissions')"
        ))
        table_exists = result.scalar()

        if not table_exists:
            conn.execute(text("""
                CREATE TABLE ta_permissions (
                    id SERIAL PRIMARY KEY,
                    enrollment_id INTEGER NOT NULL UNIQUE
                        REFERENCES enrollments(id) ON DELETE CASCADE,
                    can_grade BOOLEAN NOT NULL DEFAULT TRUE,
                    can_view_submissions BOOLEAN NOT NULL DEFAULT TRUE,
                    can_manage_testcases BOOLEAN NOT NULL DEFAULT FALSE,
                    can_view_students BOOLEAN NOT NULL DEFAULT TRUE,
                    can_manage_assignments BOOLEAN NOT NULL DEFAULT FALSE,
                    can_run_tests BOOLEAN NOT NULL DEFAULT TRUE,
                    can_view_plagiarism BOOLEAN NOT NULL DEFAULT FALSE,
                    can_view_private_tests BOOLEAN NOT NULL DEFAULT FALSE,
                    can_manage_groups BOOLEAN NOT NULL DEFAULT FALSE,
                    can_contact_students BOOLEAN NOT NULL DEFAULT FALSE,
                    can_access_reports BOOLEAN NOT NULL DEFAULT TRUE,
                    can_export_grades BOOLEAN NOT NULL DEFAULT FALSE,
                    can_view_rubrics BOOLEAN NOT NULL DEFAULT TRUE,
                    can_edit_rubrics BOOLEAN NOT NULL DEFAULT FALSE,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW(),
                    CONSTRAINT uq_ta_permission_enrollment UNIQUE (enrollment_id)
                );
            """))
            print("✅ Created ta_permissions table with all columns.")

            # Seed default permissions for existing TA enrollments
            conn.execute(text("""
                INSERT INTO ta_permissions (enrollment_id)
                SELECT id FROM enrollments WHERE role = 'ta'
                ON CONFLICT (enrollment_id) DO NOTHING;
            """))
            print("✅ Seeded default permissions for existing TAs.")
        else:
            print("ℹ️  ta_permissions table already exists. Checking for new columns...")

            # Get existing columns
            col_result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'ta_permissions'
            """))
            existing_columns = {row[0] for row in col_result}

            added = []
            for col_name, default_val in NEW_COLUMNS:
                if col_name not in existing_columns:
                    default_str = "TRUE" if default_val else "FALSE"
                    conn.execute(text(
                        f"ALTER TABLE ta_permissions ADD COLUMN {col_name} BOOLEAN NOT NULL DEFAULT {default_str}"
                    ))
                    added.append(col_name)
                    print(f"  ✓ Added column: {col_name} (default={default_val})")
                else:
                    print(f"  • Column already exists: {col_name}")

            if added:
                print(f"\n✅ Added {len(added)} new column(s).")
            else:
                print("\n✅ No changes needed — all columns already exist.")


if __name__ == "__main__":
    print("🔧 Running TA permissions migration...\n")
    migrate()
    print("\n✨ Done!")
