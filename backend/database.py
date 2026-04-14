from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file - stored in backend folder
DATABASE_URL = "sqlite:///./taskboard.db"

# Create engine with SQLite-specific settings
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Session factory for database operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()

def get_db():
    """
    Dependency that provides a database session.
    Use with FastAPI's Depends() for automatic cleanup.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Initialize database tables at app startup.
    from .models import Task, Course
    Base.metadata.create_all(bind=engine)
