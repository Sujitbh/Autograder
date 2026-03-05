"""
TA Permission model — stores per-enrollment permissions for TAs.
"""
from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class TAPermission(Base):
    __tablename__ = "ta_permissions"
    __table_args__ = (
        UniqueConstraint("enrollment_id", name="uq_ta_permission_enrollment"),
    )

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Core Permissions
    can_grade = Column(Boolean, nullable=False, default=True)
    can_view_submissions = Column(Boolean, nullable=False, default=True)
    can_run_tests = Column(Boolean, nullable=False, default=True)
    can_view_plagiarism = Column(Boolean, nullable=False, default=False)

    # Assignment & Test Permissions
    can_manage_assignments = Column(Boolean, nullable=False, default=False)
    can_manage_testcases = Column(Boolean, nullable=False, default=False)
    can_view_private_tests = Column(Boolean, nullable=False, default=False)

    # Student & Group Permissions
    can_view_students = Column(Boolean, nullable=False, default=True)
    can_manage_groups = Column(Boolean, nullable=False, default=False)
    can_contact_students = Column(Boolean, nullable=False, default=False)

    # Report & Rubric Permissions
    can_access_reports = Column(Boolean, nullable=False, default=True)
    can_export_grades = Column(Boolean, nullable=False, default=False)
    can_view_rubrics = Column(Boolean, nullable=False, default=True)
    can_edit_rubrics = Column(Boolean, nullable=False, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    enrollment = relationship("Enrollment", backref="ta_permission", uselist=False)
