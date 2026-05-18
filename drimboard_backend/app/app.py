# app.py (FastAPI version with if __name__ == "__main__": and Depends fix)
import os
import jwt
import uvicorn
import app.utils as utils
#import aws_utils as aws_utils

import app.aws_utils as aws_utils


from collections import defaultdict
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy import func as sqlfunc
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException, status, Response, Cookie, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from dotenv import load_dotenv

# from database import models, database

from app.database import models, database

# Load environment variables from .env file
load_dotenv()

# --- App Initialization ---
app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ENV = os.getenv("FLASK_ENV")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://192.168.1.7:3000",
    "https://develop.d17k1lr65yqfqv.amplifyapp.com",
    "https://main.d1piqc5khvpkwq.amplifyapp.com",
    "https://www.drim.cl"
]

# Optional env flags to allow permissive CORS and enable debug logging for preflight
CORS_ALLOW_ALL = os.getenv("CORS_ALLOW_ALL", "0") == "1"
CORS_DEBUG = os.getenv("CORS_DEBUG", "0") == "1"

if CORS_ALLOW_ALL:
    # temporary/testing mode: allow all origins and credentials
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# Middleware to log preflight requests and origins when debugging CORS issues
@app.middleware("http")
async def cors_logger(request: Request, call_next):
    origin = request.headers.get("origin")
    if CORS_DEBUG or request.method == "OPTIONS":
        print(f"CORS_LOG: {request.method} {request.url.path} Origin: {origin}")
    response = await call_next(request)
    return response
# --- Simple in-memory rate limiter for login ---
_login_attempts: dict = defaultdict(list)
_LOGIN_MAX = 10
_LOGIN_WINDOW = 300  # seconds


def _check_login_rate(identifier: str) -> bool:
    now = datetime.utcnow()
    cutoff = now - timedelta(seconds=_LOGIN_WINDOW)
    attempts = [t for t in _login_attempts[identifier] if t > cutoff]
    _login_attempts[identifier] = attempts
    if len(attempts) >= _LOGIN_MAX:
        return False
    _login_attempts[identifier].append(now)
    return True


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


def create_tables():
    """Create database tables for all models if they do not exist yet.

    This is safe to call multiple times; SQLAlchemy will only create missing
    tables. We import `models` at module level so SQLAlchemy knows about
    all model metadata.
    """
    try:
        database.Base.metadata.create_all(bind=database.engine)
        print("Database tables ensured (create_all completed).")
    except Exception as e:
        print(f"Error creating database tables: {e}")


# Ensure tables are created on FastAPI startup
@app.on_event("startup")
def on_startup():
    create_tables()


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


# --- Forum (Issue) Schemas ---
class IssueCreate(BaseModel):
    title: str
    description: Optional[str] = None
    author_name: str
    author_email: str
    tags: Optional[list[str]] = None


class IssueResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    author_name: str
    author_email: str
    status: Optional[str]
    created_time: datetime
    tags: Optional[list[str]] = None

    class Config:
        orm_mode = True


class CommentCreate(BaseModel):
    user_name: str
    user_email: str
    comment: str


class CommentResponse(BaseModel):
    id: int
    issue_id: int
    user_name: str
    user_email: str
    comment: str
    created_time: datetime

    class Config:
        orm_mode = True


# --- User Blocks Workspace Schemas ---
class UserBlocksCreate(BaseModel):
    user_name: str
    user_email: str
    filename: str
    blocks_json: str


class UserBlocksUpdate(BaseModel):
    filename: str
    blocks_json: str


class UserBlocksResponse(BaseModel):
    id: int
    user_name: str
    user_email: str
    filename: str
    blocks_json: str
    created_time: datetime
    updated_time: datetime

    class Config:
        orm_mode = True


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
def get_course_messages(course_id: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.CourseMessage).order_by(models.CourseMessage.created_time.asc())
    if course_id:
        q = q.filter(models.CourseMessage.course_id == course_id)
    return q.all()


# --- Issue endpoints (Forum) ---
@app.post("/issues", response_model=IssueResponse)
def create_issue(payload: IssueCreate, db: Session = Depends(get_db)):
    try:
        tags_str = None
        if payload.tags:
            # store as comma-separated string
            tags_str = ",".join([t.strip() for t in payload.tags if t and t.strip()])

        new_issue = models.Issue(
            title=payload.title,
            description=payload.description,
            author_name=payload.author_name,
            author_email=payload.author_email,
            tags=tags_str,
            status="open"
        )
        db.add(new_issue)
        db.commit()
        db.refresh(new_issue)

        # prepare response with tags as list
        resp = {
            "id": new_issue.id,
            "title": new_issue.title,
            "description": new_issue.description,
            "author_name": new_issue.author_name,
            "author_email": new_issue.author_email,
            "status": new_issue.status,
            "created_time": new_issue.created_time,
            "tags": new_issue.tags.split(",") if new_issue.tags else []
        }
        return resp
    except Exception as e:
        db.rollback()
        print(f"Error creating issue: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error creating discussion")


@app.get("/issues")
def list_issues(tag: Optional[str] = None, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    q = db.query(models.Issue).order_by(models.Issue.created_time.desc())
    if tag:
        q = q.filter(sqlfunc.lower(models.Issue.tags).contains(tag.strip().lower()))
    issues = q.offset(skip).limit(limit).all()

    return [
        {
            "id": it.id,
            "title": it.title,
            "description": it.description,
            "author_name": it.author_name,
            "author_email": it.author_email,
            "status": it.status,
            "created_time": it.created_time,
            "tags": it.tags.split(",") if it.tags else []
        }
        for it in issues
    ]


@app.get("/issues/{issue_id}")
def issue_detail(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")
    comments = db.query(models.IssueComment).filter(models.IssueComment.issue_id == issue_id).order_by(models.IssueComment.created_time.asc()).all()
    tags_list = issue.tags.split(",") if issue.tags else []
    issue_obj = {
        "id": issue.id,
        "title": issue.title,
        "description": issue.description,
        "author_name": issue.author_name,
        "author_email": issue.author_email,
        "status": issue.status,
        "created_time": issue.created_time,
        "tags": tags_list
    }
    return {"issue": issue_obj, "comments": comments}


@app.post("/issues/{issue_id}/comments", response_model=CommentResponse)
def add_issue_comment(issue_id: int, payload: CommentCreate, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")
    try:
        new_comment = models.IssueComment(
            issue_id=issue_id,
            user_name=payload.user_name,
            user_email=payload.user_email,
            comment=payload.comment
        )
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        return new_comment
    except Exception as e:
        db.rollback()
        print(f"Error adding comment: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error adding comment")


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
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    if not _check_login_rate(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Demasiados intentos. Por favor espera unos minutos."
        )

    user = db.query(models.Kits).filter(
        models.Kits.user_email == payload.email,
        models.Kits.kit_code == payload.kit_code
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o código de kit incorrecto"
        )

    return {"user": payload.email, "name": user.user_name, "message": "Login successful"}


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
        utils.handle_contact_form({"name": payload.name, "email": payload.email, "message": payload.message})
        return {"message": "Mensaje enviado exitosamente"}
    except Exception as e:
        print(f"Error sending contact form: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al enviar el mensaje")


# --- User Blocks Workspace endpoints ---
@app.post("/blocks/save", response_model=UserBlocksResponse)
def save_user_blocks(payload: UserBlocksCreate, db: Session = Depends(get_db)):
    """Save or update user's block workspace."""
    try:
        # Check if a workspace with this user_email and filename already exists
        existing = db.query(models.UserBlocksWorkspace).filter(
            models.UserBlocksWorkspace.user_email == payload.user_email,
            models.UserBlocksWorkspace.filename == payload.filename
        ).first()

        if existing:
            # Update existing workspace
            existing.user_name = payload.user_name
            existing.blocks_json = payload.blocks_json
            db.commit()
            db.refresh(existing)
            return existing
        else:
            # Create new workspace
            new_workspace = models.UserBlocksWorkspace(
                user_name=payload.user_name,
                user_email=payload.user_email,
                filename=payload.filename,
                blocks_json=payload.blocks_json
            )
            db.add(new_workspace)
            db.commit()
            db.refresh(new_workspace)
            return new_workspace

    except Exception as e:
        db.rollback()
        print(f"Error saving user blocks: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error saving workspace")


@app.get("/blocks/user/{user_email}", response_model=list[UserBlocksResponse])
def get_user_blocks(user_email: str, db: Session = Depends(get_db)):
    """Get all saved block workspaces for a user."""
    try:
        workspaces = db.query(models.UserBlocksWorkspace).filter(
            models.UserBlocksWorkspace.user_email == user_email
        ).order_by(models.UserBlocksWorkspace.updated_time.desc()).all()
        
        return workspaces

    except Exception as e:
        print(f"Error retrieving user blocks: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving workspaces")


@app.get("/blocks/{block_id}", response_model=UserBlocksResponse)
def get_block_workspace(block_id: int, db: Session = Depends(get_db)):
    """Get a specific block workspace by ID."""
    try:
        workspace = db.query(models.UserBlocksWorkspace).filter(
            models.UserBlocksWorkspace.id == block_id
        ).first()
        
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found"
            )
        
        return workspace

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving block workspace: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving workspace")


@app.delete("/blocks/{block_id}", response_model=MessageResponse)
def delete_block_workspace(block_id: int, db: Session = Depends(get_db)):
    """Delete a specific block workspace by ID."""
    try:
        workspace = db.query(models.UserBlocksWorkspace).filter(
            models.UserBlocksWorkspace.id == block_id
        ).first()
        
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found"
            )
        
        db.delete(workspace)
        db.commit()
        
        return {"message": f"Workspace {block_id} deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting block workspace: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error deleting workspace")


@app.get("/", response_model=MessageResponse)
def home():
    return {"message": "API is running successfully", "result": "success"}


# --- Running the App ---
if __name__ == "__main__":
    # # Create DB tables if they don't exist
    # try:
    #     print("Creating database tables if they do not exist...")
    #     create_tables()
    # except Exception as e:
    #     print(f"Warning: could not create tables automatically: {e}")

    uvicorn.run("app:app", host="0.0.0.0", port=5001, reload=True)
