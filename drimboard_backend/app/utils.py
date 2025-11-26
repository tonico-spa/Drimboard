import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def get_email_information():
    SENDER_EMAIL = os.environ.get('FASTMAIL_USER')
    SENDER_PASSWORD = os.environ.get('FASTMAIL_APP_PASSWORD')  # Your Fastmail App Password
    RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL')  # The email where you want to receive the form submissions

    return_dd = {"email_recipient": RECIPIENT_EMAIL,
                 "email_sender":SENDER_EMAIL,
                 "email_password":SENDER_PASSWORD }
    return return_dd

def handle_contact_form(data_dd):
    print(data_dd)
    name = data_dd.get('name')
    email = data_dd.get('email')
    message_body = data_dd.get('message')

    email_info_dd = get_email_information()
    email_sender = email_info_dd["email_sender"]
    email_recipient = email_info_dd["email_recipient"]
    email_password = email_info_dd["email_password"]



    if not all([name, email, message_body]):
        return {"error": "Missing form data"}

    # --- Create the Email ---
    msg = MIMEMultipart()
    # The 'From' header can be your actual email or a more descriptive one
    msg['From'] = f"Duolab Contact Form <{email_sender}>"
    msg['To'] = email_recipient
    msg['Subject'] = f"New Contact Form Submission from {name}"
    # Set the Reply-To header to the user's email to reply directly to them
    msg.add_header('Reply-To', email)


    # Email Body
    body = f"""
    You have a new submission from Duolab contact form:

    Name: {name}
    Email: {email}
    Message:
    {message_body}
    """
    msg.attach(MIMEText(body, 'plain'))

    # --- Send the Email using Fastmail's SMTP Server ---
    try:
        # Use smtplib.SMTP_SSL for a secure connection on port 465
        with smtplib.SMTP_SSL('smtp.fastmail.com', 465) as server:
            server.login(email_sender, email_password)
            server.send_message(msg)
        return {"message": "Email sent successfully!"}
    except Exception as e:
        # For debugging, it's helpful to print the error
        print(f"Error sending email: {e}")
        return {"error": "Failed to send email"}