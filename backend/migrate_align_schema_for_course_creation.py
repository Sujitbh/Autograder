"""
Migration: align legacy schema with current models required for course creation.
Run once: python migrate_align_schema_for_course_creation.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import engine

STATEMENTS = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS sis_user_id VARCHAR",
    "ALTER TABLE courses ADD COLUMN IF NOT EXISTS section VARCHAR",
    "ALTER TABLE courses ADD COLUMN IF NOT EXISTS enrollment_policy VARCHAR NOT NULL DEFAULT 'invite'",
    "ALTER TABLE assignments ADD COLUMN IF NOT EXISTS max_points INTEGER DEFAULT 100",
    "ALTER TABLE assignments ADD COLUMN IF NOT EXISTS starter_code TEXT",
    "ALTER TABLE assignments ADD COLUMN IF NOT EXISTS status VARCHAR NOT NULL DEFAULT 'published'",
]

with engine.connect() as conn:
    for stmt in STATEMENTS:
        conn.execute(text(stmt))
    conn.commit()

print("Migration complete: schema aligned for course creation")
