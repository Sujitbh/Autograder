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

    @staticmethod
    def send_password_reset_email(to_email: str, reset_url: str):
        """
        Sends a password reset email with a link containing the reset token.
        Currently logs the email; swap with SMTP / SendGrid / SES in production.
        """
        subject = "Axiom — Password Reset Request"
        body = f"""
Hello,

We received a request to reset the password for your Axiom account ({to_email}).

Click the link below to set a new password (valid for 1 hour):
{reset_url}

If you did not request this, you can safely ignore this email.

Best regards,
The Axiom Team
"""
        logger.info(f"========== PASSWORD RESET EMAIL TO: {to_email} ==========")
        logger.info(f"Subject: {subject}")
        logger.info(body)
        logger.info("==========================================================")
