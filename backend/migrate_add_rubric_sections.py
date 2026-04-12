"""
Migration: Add rubric_sections and rubric_criteria tables.
Run once: python migrate_add_rubric_sections.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import engine

with engine.connect() as conn:
    # Create rubric_sections table
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS rubric_sections (
            id SERIAL PRIMARY KEY,
            assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
            name VARCHAR NOT NULL,
            description TEXT,
            weight FLOAT DEFAULT 1.0,
            "order" INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(assignment_id, name)
        )
    """))
    
    # Create rubric_criteria table
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS rubric_criteria (
            id SERIAL PRIMARY KEY,
            section_id INTEGER NOT NULL REFERENCES rubric_sections(id) ON DELETE CASCADE,
            name VARCHAR NOT NULL,
            description TEXT,
            weight FLOAT DEFAULT 1.0,
            max_points INTEGER DEFAULT 10,
            grading_method VARCHAR DEFAULT 'manual',
            "order" INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(section_id, name)
        )
    """))
    
    legacy_rubrics_exists = conn.execute(text("""
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'rubrics'
        )
    """)).scalar()

    if legacy_rubrics_exists:
        # Migrate existing legacy rubrics into a default section per assignment.
        conn.execute(text("""
            INSERT INTO rubric_sections (assignment_id, name, weight)
            SELECT DISTINCT assignment_id, 'Rubric Criteria', 100.0
            FROM rubrics
            WHERE NOT EXISTS (
                SELECT 1
                FROM rubric_sections rs
                WHERE rs.assignment_id = rubrics.assignment_id
                  AND rs.name = 'Rubric Criteria'
            )
        """))

        conn.execute(text("""
            INSERT INTO rubric_criteria (section_id, name, description, weight, max_points, grading_method, "order")
            SELECT
                rs.id,
                r.name,
                r.description,
                COALESCE(r.weight, 1.0),
                COALESCE(r.max_points, 0),
                'manual',
                COALESCE(r."order", 0)
            FROM rubrics r
            JOIN rubric_sections rs ON r.assignment_id = rs.assignment_id AND rs.name = 'Rubric Criteria'
            WHERE NOT EXISTS (
                SELECT 1
                FROM rubric_criteria rc
                WHERE rc.section_id = rs.id
                  AND rc.name = r.name
            )
        """))
    
    conn.commit()
    print("Migration complete: rubric_sections and rubric_criteria tables created")
    print("Existing rubrics migrated to section-based structure")

