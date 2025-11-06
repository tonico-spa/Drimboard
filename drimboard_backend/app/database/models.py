from sqlalchemy import Column, Integer, String, DateTime
from database.database import Base

class DrimKits(Base):
    __tablename__ = "drim_kit"

    id = Column(Integer, primary_key=True, index=True)
    kit_code = Column(String, index=True)
    user_name = Column(String, index=True) # This likely stores the user's email
    user_email = Column(String, index=True) # This likely stores the user's email
    user_type = Column(String, index=True)
