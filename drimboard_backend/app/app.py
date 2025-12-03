# app.py (FastAPI version with if __name__ == "__main__": and Depends fix)
import os
import jwt
import uvicorn
import aws_utils as aws_utils
import utils
# import app.aws_utils as aws_utils


from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session  # <--- ADD THIS IMPORT
from fastapi import FastAPI, Depends, HTTPException, status, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from dotenv import load_dotenv

from database import models, database

# from app.database import models, database

# Load environment variables from .env file
load_dotenv()

# --- App Initialization ---
app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ENV = os.getenv("FLASK_ENV")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.7:3000"
    "https://develop.d17k1lr65yqfqv.amplifyapp.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # NOT ["*"]
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- Configuration ---
SECRET_KEY = os.getenv("JWT_SECRET")
if not SECRET_KEY:
    raise ValueError("JWT_SECRET environment variable not set.")


# --- Database Dependency ---
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Pydantic Models for Request/Response Bodies ---
class CourseMessageCreate(BaseModel):
    user_name: str
    user_email: str
    message: str
    course_id: str


class CourseMessageResponse(BaseModel):
    user_name: str
    user_email: str
    message: str
    created_time: datetime
    course_id: str

    class Config:
        orm_mode = True


class PresignedUrlRequest(BaseModel):
    course_name: str


class LoginRequest(BaseModel):
    email: str
    kit_code: str


class ContactForm(BaseModel):
    name: str
    email: str
    message: str


class MessageResponse(BaseModel):
    message: str
    user: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    result: Optional[str] = None


@app.post("/create_course_message", response_model=MessageResponse)
def create_course_message(message: CourseMessageCreate, db: Session = Depends(get_db)):  # <--- FIXED HERE
    try:
        new_message = models.CourseMessage(
            user_name=message.user_name,
            user_email=message.user_email,
            message=message.message,
            course_id=message.course_id
        )

        db.add(new_message)
        db.commit()
        db.refresh(new_message)

        print(f"Message inserted with ID: {new_message.id}")
        return {"message": f"Message inserted with ID: {new_message.id}"}

    except Exception as e:
        db.rollback()
        print(f"Error inserting message: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error inserting message")


@app.get("/get_course_messages", response_model=list[CourseMessageResponse])
def get_course_messages(db: Session = Depends(get_db)):  # <--- FIXED HERE
    message_ls = db.query(models.CourseMessage).all()
    return message_ls


@app.post("/get_single_pdf")
def generate_presigned_url(data: PresignedUrlRequest):
    try:
        file_key = data.course_name

        key_id = os.getenv("S3_AWS_ACCESS_KEY_ID")
        access_key = os.getenv("S3_AWS_SECRET_ACCESS_KEY")
        region = os.getenv("AWS_REGION")
        bucket = os.getenv("S3_BUCKET_NAME")

        if not all([key_id, access_key, region, bucket]):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="S3 AWS credentials or bucket name are not fully configured."
            )

        s3_client = aws_utils.get_s3_client(key_id=key_id, access_key=access_key, region=region)

        try:
            response = s3_client.head_object(
                Bucket=bucket,
                Key=file_key
            )
            print("File exists!")
            print(f"Size: {response['ContentLength']} bytes")
            print(f"Content-Type: {response['ContentType']}")
        except Exception as e:
            print(f"File {file_key} not found in bucket {bucket}: {e}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"File {file_key} not found")

        if not file_key:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="file_key is required")

        params = {
            "Bucket": bucket,
            "Key": file_key
        }

        url = s3_client.generate_presigned_url(
            "get_object",
            Params=params,
            ExpiresIn=3600
        )

        return {"url": url}

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Error generating URL: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@app.post("/login", response_model=MessageResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = payload.email
    kit_code = payload.kit_code

    user = db.query(models.Kits).filter(
        models.Kits.user_email == email,
        models.Kits.kit_code == kit_code
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    return {"user": email, "name": "ignacia baeza", "message": "Login successful"}


@app.get("/profile", response_model=MessageResponse)
def profile(token: Optional[str] = Cookie(None)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized, no token provided"
        )

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return {"email": data["email"], "message": "This is your profile."}
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


@app.post("/logout", response_model=MessageResponse)
def logout(response: Response):
    response.set_cookie(key="token", value="", expires=0, httponly=True)
    return {"message": "Logout successful"}


@app.post("/send_form", response_model=MessageResponse)
def send_form(payload: ContactForm):
    try:
        name = payload.name
        email = payload.email
        message = payload.message

        data_dd = {
            "name": name,
            "email": email,
            "message": message
        }
        utils.handle_contact_form(data_dd)

        return {"message": "Logout successful"}
    except Exception as exc:
        return {"result": exc}


@app.get("/", response_model=MessageResponse)
def home():
    return {"message": "API is running successfully", "result": "success"}


# --- Running the App ---
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5001, reload=True)
