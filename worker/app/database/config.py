from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings


engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def create_tables():
    # 1. Open a connection
    with engine.connect() as connection:
        # 2. Enable the extension automatically! ⚡
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        connection.commit()
        print("✅ 'vector' extension enabled.")

    # 3. NOW create the tables (This will work now!)
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully.")

if __name__ == "__main__":
    create_tables()

