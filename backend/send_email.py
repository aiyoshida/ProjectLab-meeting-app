import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email import encoders
from dotenv import load_dotenv
from typing import Optional

# If I want to make this app smoother, it is better to use fastAPI BackgroundTasks, so that I can make this func into work separately.

def send_email(receiver: str, subject: str, body: str, ics: Optional[str] = None):
    load_dotenv()  # read .env

    # HTML + plain text
    # https://realpython.com/python-send-email

    # security reasons, hide these from uploading
    receiver_email = receiver
    sender_email = os.getenv("EMAIL_USER")
    app_password = os.getenv("EMAIL_PASS")
    # receiver_email = os.getenv("TEST_RECIPIENT")

    if not sender_email or not app_password or not receiver_email:
        raise RuntimeError("No enough env variables")

    # email contents
    msg = MIMEMultipart("alternative") # for adding ics
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Content-class"] = "urn:content-classes:calendarmessage"
    msg.attach(MIMEText(body, "plain", "utf-8"))

    # ics Reference 1: https://www.baryudin.com/blog/sending-outlook-appointments-python
    # ics Reference 2: https://mailtrap.io/blog/python-send-email-gmail/
    # ics Reference 3: https://developers.google.com/workspace/calendar/api/concepts/inviting-attendees-to-events
    if ics:
        filename = "invite.ics"
        part = MIMEBase('text', "calendar", method="REQUEST", name=filename)
        part.set_payload(ics)
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f'attachment; filename="{filename}"')
        msg.attach(part)



    # Send by Gmail SMTP（SSL 465）
    smtp_host = "smtp.gmail.com"
    smtp_port = 465

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
        server.login(sender_email, app_password)
        server.sendmail(sender_email, [receiver_email], msg.as_string())

    # print("test email has done!")


# trial for sending email

# if __name__ == "__main__":
#     try:
#         send_test_mail()
#     except Exception as e:
#         print("Failed to send the email:", repr(e))
