"""
Migration: Add missing columns to submission_files table.
Adds: file_size, content_type, created_at
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import engine

MIGRATIONS = [
    ("file_size", "ALTER TABLE submission_files ADD COLUMN file_size BIGINT"),
    ("content_type", "ALTER TABLE submission_files ADD COLUMN content_type VARCHAR"),
    ("created_at", "ALTER TABLE submission_files ADD COLUMN created_at TIMESTAMPTZ DEFAULT now()"),
]

def migrate():
    with engine.connect() as conn:
        existing = {
            row[0]
            for row in conn.execute(
                text("SELECT column_name FROM information_schema.columns WHERE table_name = 'submission_files'")
            )
        }
        print(f"Existing columns: {sorted(existing)}")

        for col_name, sql in MIGRATIONS:
            if col_name in existing:
                print(f"  ✓ {col_name} already exists")
            else:
                conn.execute(text(sql))
                print(f"  + Added {col_name}")
        conn.commit()
        print("Done.")


if __name__ == "__main__":
    migrate()
