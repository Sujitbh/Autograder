"""
Migration: add assignment-level AI policy fields.
Run once: python migrate_add_assignment_ai_policy.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text

from app.core.database import engine


with engine.connect() as conn:
    conn.execute(text("ALTER TABLE assignments ADD COLUMN IF NOT EXISTS ai_detection_enabled BOOLEAN DEFAULT TRUE"))
    conn.execute(text("ALTER TABLE assignments ADD COLUMN IF NOT EXISTS auto_flag_enabled BOOLEAN DEFAULT TRUE"))
    conn.execute(text("ALTER TABLE assignments ADD COLUMN IF NOT EXISTS auto_flag_threshold DOUBLE PRECISION DEFAULT 0.70"))

    # Backfill nulls for existing rows.
    conn.execute(text("UPDATE assignments SET ai_detection_enabled = TRUE WHERE ai_detection_enabled IS NULL"))
    conn.execute(text("UPDATE assignments SET auto_flag_enabled = TRUE WHERE auto_flag_enabled IS NULL"))
    conn.execute(text("UPDATE assignments SET auto_flag_threshold = 0.70 WHERE auto_flag_threshold IS NULL"))
    conn.commit()
    print("Migration complete: assignment AI policy fields added.")
