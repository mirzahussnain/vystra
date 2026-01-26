from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

from ..core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    # 1. Ping the DB before every query. If dead, reconnect automatically.
    pool_pre_ping=True,
    # 2. Recycle connections every 30 minutes to prevent staleness
    pool_recycle=1800,
    # 3. Connection pool size (keep small for serverless)
    pool_size=10,
    max_overflow=20,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_extension():
    # 3. Enable Extension
    with engine.connect() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        connection.commit()
        print(" 'vector' extension enabled.")
