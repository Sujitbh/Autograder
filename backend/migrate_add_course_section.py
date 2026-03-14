"""
Migration: add section column to courses table.
Run once: python migrate_add_course_section.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE courses ADD COLUMN IF NOT EXISTS section VARCHAR"))
    conn.commit()
    print("Migration complete: section column added to courses table")
