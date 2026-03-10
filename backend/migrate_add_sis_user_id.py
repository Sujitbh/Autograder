"""
Migration: add sis_user_id column to users table.
Run once: python migrate_add_sis_user_id.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS sis_user_id VARCHAR"))
    conn.commit()
    print("Migration complete: sis_user_id column added to users table")
