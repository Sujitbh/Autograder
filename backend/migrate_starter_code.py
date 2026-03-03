"""
Migration: Add starter_code column to assignments table.

Run:
    cd backend && source venv/bin/activate && python migrate_starter_code.py
"""

from app.core.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        # Check if the column already exists
        result = conn.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='assignments' AND column_name='starter_code'"
        ))
        if result.fetchone():
            print("Column 'starter_code' already exists — nothing to do.")
            return

        conn.execute(text(
            "ALTER TABLE assignments ADD COLUMN starter_code TEXT"
        ))
        conn.commit()
        print("Added 'starter_code' column to assignments table.")

if __name__ == "__main__":
    migrate()
