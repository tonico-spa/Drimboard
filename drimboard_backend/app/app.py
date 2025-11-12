# app.py
import os
import jwt
import aws_utils
import boto3

from datetime import datetime, timedelta
from sqlalchemy import create_engine, text
from flask import Flask, request, jsonify, make_response
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
from database import models, database

# Load environment variables from .env file
load_dotenv()

# --- App Initialization ---
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# --- Configuration ---
app.config["SECRET_KEY"] = os.getenv("JWT_SECRET")

ENV = os.getenv("FLASK_ENV")


# --- Mock Database Function ---
# (Replace this with your actual RDS database call)
# print("Creating database tables...")
# database.Base.metadata.create_all(bind=database.engine)
# print("Tables created.")
@app.route("/create_course_message", methods=["POST"])
def create_course_message():
    db = database.SessionLocal()

    data = request.get_json()
    try:
        new_message = models.CourseMessage(
            user_name=data["name"],
            user_email=data["email"],
            message=data["message"],
            course_id=data["course_id"]
        )

        db.add(new_message)
        db.commit()
        db.refresh(new_message)

        print(f"Message inserted with ID: {new_message.id}")
        return jsonify({"result": f"Message inserted with ID: {new_message.id}"})

    except Exception as e:
        db.rollback()
        print(f"Error inserting message: {e}")
        raise
    finally:
        db.close()

@app.route("/get_course_messages", methods=["GET"])
def get_course_messages():

    db = database.SessionLocal()
    message_ls = db.query(models.CourseMessage).all()
    return_ls = list()

    for message in message_ls:
        aux_dd = {"name": message.user_name,
                  "email": message.user_email,
                  "message": message.message,
                  "created_time": message.created_time,
                  "course_id": message.course_id}
        return_ls.append(aux_dd)

    return jsonify({"messages": return_ls})





@app.route("/get_single_pdf", methods=["POST"])
def generate_presigned_url():
    try:
        data = request.get_json()
        file_key = data.get("course_name")

        key_id = os.getenv("S3_AWS_ACCESS_KEY_ID")
        access_key = os.getenv("S3_AWS_SECRET_ACCESS_KEY")
        region = os.getenv("AWS_REGION")
        bucket = os.getenv("S3_BUCKET_NAME")

        s3_client = aws_utils.get_s3_client(key_id=key_id, access_key=access_key, region=region)


        response = s3_client.head_object(
            Bucket='drim-material-files',
            Key='colores.pdf'
        )
        print("File exists!")
        print(f"Size: {response['ContentLength']} bytes")
        print(f"Content-Type: {response['ContentType']}")
        if not file_key:
            return jsonify({"error": "file_key is required"}), 400

        params = {
            "Bucket": bucket,
            "Key": file_key
        }

        url = s3_client.generate_presigned_url(
            "get_object",
            Params=params,
        )

        return jsonify({"url": url})

    except Exception as e:
        print(f"Error generating URL: {e}")
        return jsonify({"error": "Internal server error"}), 500




@app.route("/login", methods=["POST"])
def login():
    payload = request.json
    email = payload.get("email")
    kit_code = payload.get("kit_code")

    if not email or not kit_code:
        return jsonify({"message": "Email and kit_code are required"}), 400

    db = database.SessionLocal()
    try:
        user = db.query(models.Kits).filter(
            models.Kits.user_email == email,
            models.Kits.kit_code == kit_code
        ).first()
    finally:
        db.close()

    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    # Create the JWT token
    token = jwt.encode({
        "email": email,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(days=1)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    response = make_response(jsonify({"user": email, "name": "ignacia baeza", "message": "Login successful"}))

    # Set the token in an HTTPOnly cookie
    if ENV == "prod":
        response.set_cookie(key="token", value=token, httponly=True, secure=True, samesite="Lax")
    else:
        response.set_cookie(key="token", value=token, httponly=True, secure=False, samesite="Lax")

    return response

@app.route("/profile", methods=["GET"])
def profile():
    token = request.cookies.get("token")
    if not token:
        return jsonify({"message": "Not authorized, no token provided"}), 401

    try:
        data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return jsonify({"email": data["email"], "message": "This is your profile."})
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401


@app.route("/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logout successful"}))
    response.set_cookie(key="token", value="", expires=0, httponly=True)
    return response


# --- Running the App ---
if __name__ == "__main__":
    app.run(debug=True, port=5001, host='0.0.0.0')  # Runs on port 5001
