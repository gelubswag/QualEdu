from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import create_engine   


def get_database_engine():
    return create_engine('postgresql+psycopg2://postgres:wedxzafutyn05@localhost:5432', echo=True)

SessionLocal = sessionmaker(
    bind=get_database_engine(),
    )

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()