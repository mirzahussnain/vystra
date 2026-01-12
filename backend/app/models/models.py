from sqlalchemy import Column,String,Text,DateTime
from sqlalchemy.sql import func
from app.database.database import Base


class Video(Base):
    __tablename__='videos'
    id=Column(String,primary_key=True,index=True)
    title=Column(String,index=True)
    description=Column(Text,nullable=True)
    transcript=Column(Text,nullable=True)
    s3_key=Column(String)  # filename in Minio
    created_at=Column(DateTime(timezone=True),server_default=func.now())