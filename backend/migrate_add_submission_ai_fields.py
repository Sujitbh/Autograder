"""
Migration: add AI detector result fields to submissions.
Run once: python migrate_add_submission_ai_fields.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text

from app.core.database import engine


with engine.connect() as conn:
    conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ai_confidence DOUBLE PRECISION"))
    conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ai_flagged BOOLEAN"))
    conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ai_threshold_used DOUBLE PRECISION"))
    conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ai_model_language VARCHAR"))
    conn.commit()
    print("Migration complete: AI detector fields added to submissions table")
