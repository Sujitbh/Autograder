import logging
from typing import Optional

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_enrollment_email(to_email: str, course_name: str, course_code: Optional[str] = None):
        """
        Simulates sending an enrollment confirmation email to the student.
        In a real application, this would use an SMTP server or an email API like SendGrid/AWS SES.
        """
        code_str = f" ({course_code})" if course_code else ""
        
        subject = f"Enrollment Confirmation: {course_name}"
        body = f"""
Hello,

You have been successfully enrolled in {course_name}{code_str}.
You can now log in to the Axiom dashboard to access your course materials and assignments.

Best regards,
The Axiom Team
"""
        
        # Log instead of sending
        logger.info(f"========== EMAIL SENT TO: {to_email} ==========")
        logger.info(f"Subject: {subject}")
        logger.info(body)
        logger.info("==================================================")
