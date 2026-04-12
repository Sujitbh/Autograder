"""
Migration: add rubric_mode column to assignments.
Run once: python migrate_add_rubric_mode.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE assignments ADD COLUMN IF NOT EXISTS rubric_mode VARCHAR NOT NULL DEFAULT 'unweighted'"))
    conn.commit()
    print("Migration complete: rubric_mode column added to assignments table")
