from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker,declarative_base
from app.core.config import settings



engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()



# Dependency (We use this in FastAPI endpoints)
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
        print("✅ 'vector' extension enabled.")