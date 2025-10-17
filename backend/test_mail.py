import os
import smtplib
import ssl
from email.mime.text import MIMEText
from dotenv import load_dotenv


def send_test_mail():
    load_dotenv()  # read .env

    sender = os.getenv("EMAIL_USER")
    app_password = os.getenv("EMAIL_PASS")
    to = os.getenv("TEST_RECIPIENT")

    if not sender or not app_password or not to:
        raise RuntimeError(
            "No enough env variables"
        )

    # email contents
    subject = "AcrossTime: SMTP test email"
    body = "This email is for SMTP test."
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to

    # Send by Gmail SMTP（SSL 465）
    smtp_host = "smtp.gmail.com"
    smtp_port = 465

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
        server.login(
            sender, app_password
        )  
        server.sendmail(sender, [to], msg.as_string())

    print("test email has done!")


if __name__ == "__main__":
    try:
        send_test_mail()
    except Exception as e:
        print("Failed to send the email:", repr(e))
