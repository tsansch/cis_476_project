from sqlalchemy import Column, String, Text, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class Course(Base):
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    color = Column(String(7), nullable=True)

    tasks = relationship("Task", back_populates="course")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(10), nullable=False, default="Medium")
    due_date = Column(Date, nullable=True)
    completed = Column(Boolean, nullable=False, default=False)
    is_recurring = Column(Boolean, nullable=False, default=False)  # added

    course_id = Column(String(36), ForeignKey("courses.id"), nullable=True)
    course = relationship("Course", back_populates="tasks")