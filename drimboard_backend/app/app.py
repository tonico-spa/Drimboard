# app.py
import os
from datetime import datetime, timedelta
import jwt
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

@app.route("/login", methods=["POST"])
def login():
    # ... (your existing code to get email, kit_code, and user) ...
    payload = request.json
    email = payload["email"]
    kit_code = payload["kit_code"]
    db = database.SessionLocal()

    try:
        user = db.query(models.DrimKits).filter(
            models.DrimKits.user == email,
            models.DrimKits.code == kit_code
        ).first()
    finally:
        db.close()

    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({
        "email": user.user,
        "iat": datetime.utcnow(),  # Issued At (good practice)
        "exp": datetime.utcnow() + timedelta(days=1)  # Expiration (e.g., 1 day from now)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    response = make_response(jsonify({"user": user.user}))
    if ENV == "prod":
        response.set_cookie(key="token", value=token, httponly=True, secure=True, samesite="Lax")
    else:
        response.set_cookie(key="token", value=token, httponly=True, secure=False, samesite="Lax",)

    return response


@app.route("/profile", methods=["GET"])  # <-- Use GET
def profile():
    token = request.cookies.get("token")
    print(request.cookies)
    if not token:
        return jsonify({"message": "Not authorized"}), 401
    try:
        data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return jsonify({"email": data["email"], "message": "This is your profile."})
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"message": "Invalid or expired token"}), 401


@app.route("/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logout successful"}))
    response.set_cookie(key="token", value="", expires=0, httponly=True)
    return response


# --- Running the App ---
if __name__ == "__main__":
    app.run(debug=True, port=5001, host='0.0.0.0')  # Runs on port 5001
