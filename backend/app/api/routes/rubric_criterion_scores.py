"""
Rubric Criterion Scoring API routes for submission grading with weighted rubrics.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.submission_rubric_criterion_score import SubmissionRubricCriterionScore
from app.models.submission import Submission
from app.models.rubric_section import RubricCriterion
from app.schemas.rubric import RubricCriterionScoreOut, RubricCriterionScoreCreate, RubricCriterionScoreUpdate
from app.models.user import User

router = APIRouter(prefix="/rubric-criterion-scores", tags=["rubric-criterion-scores"])


@router.post("", response_model=RubricCriterionScoreOut)
def create_criterion_score(
    payload: RubricCriterionScoreCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Create or update a criterion score for a submission."""
    
    # Check if submission exists
    submission = db.query(Submission).filter(Submission.id == payload.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Check if criterion exists
    criterion = db.query(RubricCriterion).filter(RubricCriterion.id == payload.criterion_id).first()
    if not criterion:
        raise HTTPException(status_code=404, detail="Criterion not found")
    
    # Check for existing score
    existing_score = db.query(SubmissionRubricCriterionScore).filter(
        SubmissionRubricCriterionScore.submission_id == payload.submission_id,
        SubmissionRubricCriterionScore.criterion_id == payload.criterion_id,
    ).first()
    
    if existing_score:
        # Update existing score
        existing_score.grade = payload.grade
        existing_score.percent_weight = payload.percent_weight
        existing_score.points_awarded = payload.points_awarded
        existing_score.feedback = payload.feedback
        existing_score.grader_id = user.id
        db.add(existing_score)
        db.commit()
        db.refresh(existing_score)
        return existing_score
    
    # Create new score
    score = SubmissionRubricCriterionScore(
        submission_id=payload.submission_id,
        criterion_id=payload.criterion_id,
        grade=payload.grade,
        percent_weight=payload.percent_weight,
        points_awarded=payload.points_awarded,
        feedback=payload.feedback,
        grader_id=user.id,
    )
    db.add(score)
    db.commit()
    db.refresh(score)
    return score


@router.get("/submission/{submission_id}", response_model=List[RubricCriterionScoreOut])
def get_submission_scores(
    submission_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get all criterion scores for a submission."""
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return db.query(SubmissionRubricCriterionScore).filter(
        SubmissionRubricCriterionScore.submission_id == submission_id
    ).all()


@router.get("/{score_id}", response_model=RubricCriterionScoreOut)
def get_criterion_score(
    score_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get a specific criterion score."""
    score = db.query(SubmissionRubricCriterionScore).filter(SubmissionRubricCriterionScore.id == score_id).first()
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    
    return score


@router.put("/{score_id}", response_model=RubricCriterionScoreOut)
def update_criterion_score(
    score_id: int,
    payload: RubricCriterionScoreUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Update a criterion score."""
    score = db.query(SubmissionRubricCriterionScore).filter(SubmissionRubricCriterionScore.id == score_id).first()
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    
    score.grade = payload.grade
    score.percent_weight = payload.percent_weight
    score.points_awarded = payload.points_awarded
    score.feedback = payload.feedback
    score.grader_id = user.id
    
    db.add(score)
    db.commit()
    db.refresh(score)
    return score


@router.delete("/{score_id}")
def delete_criterion_score(
    score_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Delete a criterion score."""
    score = db.query(SubmissionRubricCriterionScore).filter(SubmissionRubricCriterionScore.id == score_id).first()
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    
    db.delete(score)
    db.commit()
    
    return {"detail": "Score deleted"}
