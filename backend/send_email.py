import os
import smtplib
import ssl
from email.mime.text import MIMEText
from dotenv import load_dotenv


def send_email(receiver: str, subject: str, body: str):
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
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = receiver_email

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
