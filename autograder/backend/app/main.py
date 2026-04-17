from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
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

app = FastAPI(
    title="Autograder API",
    description="API for automated code grading system",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)


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

