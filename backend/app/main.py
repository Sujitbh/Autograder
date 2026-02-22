from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.database import Base, engine
from app.api.deps import get_db
import app.models  # ensure all models are imported so metadata is complete
from app.api.routes import (
    auth,
    assignments,
    courses,
    testcases,
    rubrics,
    submissions,
    faculty_downloads,
    grading,
)
from app.settings import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Autograder API",
    description="API for automated code grading system",
    version="1.0.0",
)

# Create all tables on startup
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified successfully")
    # Quick connectivity check
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    logger.info(f"Database connection OK: {settings.DATABASE_URL.split('@')[1]}")
except Exception as e:
    logger.error(f"Database connection FAILED: {e}")


@app.get("/")
def root():
    return {"message": "Welcome to the Autograder API. See /docs for API documentation."}


# Register all routers
app.include_router(auth.router, prefix="/api")
app.include_router(assignments.router, prefix="/api")
app.include_router(courses.router, prefix="/api")
app.include_router(testcases.router, prefix="/api")
app.include_router(rubrics.router, prefix="/api")
app.include_router(submissions.router, prefix="/api")
app.include_router(grading.router, prefix="/api")
app.include_router(faculty_downloads.router, prefix="/api")

# Enable CORS for development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/health/db")
def health_db(db: Session = Depends(get_db)):
    """Database connectivity check — returns success/fail with diagnostics."""
    try:
        result = db.execute(text("SELECT 1")).scalar()
        table_count = db.execute(
            text("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'")
        ).scalar()
        user_count = db.execute(text("SELECT count(*) FROM users")).scalar()
        course_count = db.execute(text("SELECT count(*) FROM courses")).scalar()
        assignment_count = db.execute(text("SELECT count(*) FROM assignments")).scalar()
        return {
            "status": "connected",
            "db_host": settings.DATABASE_URL.split("@")[1].split("/")[0],
            "db_name": settings.DATABASE_URL.split("/")[-1],
            "tables": table_count,
            "rows": {
                "users": user_count,
                "courses": course_count,
                "assignments": assignment_count,
            },
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

