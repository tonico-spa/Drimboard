from sqlalchemy import Column, Integer, String, DateTime
from database import database

class DrimKits(database.Base):
    __tablename__ = "drim_kits"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, index=True)
    user = Column(String, index=True)
    user_type = Column(String, index=True)
    created_at = Column(DateTime, index=True)

