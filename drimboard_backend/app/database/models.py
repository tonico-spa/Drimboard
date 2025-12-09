from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from database.database import Base
# from app.database.database import Base


class Kits(Base):
    __tablename__ = "drim_kits"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(100), nullable=False)
    kit_code = Column(String(100), nullable=False)
    user_email = Column(String(255), nullable=False, unique=True, index=True)
    user_type = Column(String(50))
    created_time = Column(TIMESTAMP, server_default=func.now())


class CourseMessage(Base):
    __tablename__ = "drim_course_chats"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(100), nullable=False)
    user_email = Column(String(100), nullable=False)
    message = Column(Text)
    course_id = Column(String(50), nullable=False)
    created_time = Column(TIMESTAMP, server_default=func.now())


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    author_name = Column(String(100), nullable=False)
    author_email = Column(String(255), nullable=False)
    tags = Column(Text, nullable=True)
    status = Column(String(50), default="open")
    created_time = Column(TIMESTAMP, server_default=func.now())


class IssueComment(Base):
    __tablename__ = "issue_comments"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, nullable=False, index=True)
    user_name = Column(String(100), nullable=False)
    user_email = Column(String(255), nullable=False)
    comment = Column(Text)
    created_time = Column(TIMESTAMP, server_default=func.now())