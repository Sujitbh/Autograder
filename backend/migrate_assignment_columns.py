"""
Migration: Add 'status' and 'max_points' columns to the assignments table.

Idempotent — safe to run multiple times.
"""

from sqlalchemy import text
from app.core.database import engine


def migrate():
    columns = [
        ("status", "VARCHAR NOT NULL DEFAULT 'published'"),
        ("max_points", "INTEGER DEFAULT 100"),
    ]

    with engine.connect() as conn:
        for col_name, col_def in columns:
            # Check if column already exists
            result = conn.execute(text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name = 'assignments' AND column_name = :col"
            ), {"col": col_name})
            if result.fetchone():
                print(f"  ✓ Column '{col_name}' already exists")
            else:
                conn.execute(text(
                    f"ALTER TABLE assignments ADD COLUMN {col_name} {col_def}"
                ))
                print(f"  + Added column '{col_name}'")

        conn.commit()
    print("Migration complete.")


if __name__ == "__main__":
    migrate()
