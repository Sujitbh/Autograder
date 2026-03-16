from .user import User
from .message import Message
from .assignment import Assignment
from .submission import Submission
from .submission_file import SubmissionFile

# additional models
from .course import Course
from .enrollment import Enrollment
from .testcase import TestCase
from .rubric import Rubric
from .group import Group, GroupMembership
from .submission_result import SubmissionResult
from .submission_rubric_score import SubmissionRubricScore
from .language import Language
from .ta_invitation import TAInvitation
from .semester import Semester
from .audit_log import AuditLog
from .system_setting import SystemSetting
from .ta_permission import TAPermission

# Expose symbols for convenience
__all__ = [
	"User",
	"Message",
	"Assignment",
	"Submission",
	"SubmissionFile",
	"Course",
	"Enrollment",
	"TestCase",
	"Rubric",
	"Group",
	"GroupMembership",
	"SubmissionResult",
	"SubmissionRubricScore",
	"Language",
	"TAInvitation",
	"Semester",
	"AuditLog",
	"SystemSetting",
	"TAPermission",
]
