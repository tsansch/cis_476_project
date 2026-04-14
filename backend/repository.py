from sqlalchemy.orm import Session
from models import Task, Course
from typing import Optional
from datetime import date

# Task Repository
class TaskRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Task]:
        # Get all tasks
        return self.db.query(Task).all()

    def get_by_id(self, task_id: str) -> Optional[Task]:
        # Get task by ID
        return self.db.query(Task).filter(Task.id == task_id).first()

    def create(
        self,
        title: str,
        description: Optional[str] = None,
        priority: str = "Medium",
        due_date: Optional[date] = None,
        course_id: Optional[str] = None,
        is_recurring: bool = False,  # stores whether the task repeats (4/14)
        repeat_type: Optional[str] = None,  # stores daily, weekly, or monthly (4/14)
    ) -> Task:
        # Create new task
        task = Task(
            title=title,
            description=description,
            priority=priority,
            due_date=due_date,
            course_id=course_id,
            is_recurring=is_recurring,  # save recurring flag (4/14)
            repeat_type=repeat_type,  # save repeat type (4/14)
        )
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update(self, task: Task, **kwargs) -> Task:
        for key, value in kwargs.items():
            if hasattr(task, key) and value is not None:
                setattr(task, key, value)
        self.db.commit()
        self.db.refresh(task)
        return task

    def delete(self, task: Task) -> None:
        self.db.delete(task)
        self.db.commit()

    def toggle_complete(self, task: Task) -> Task:
        task.completed = not task.completed
        self.db.commit()
        self.db.refresh(task)
        return task


# Course Repository
class CourseRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Course]:
        return self.db.query(Course).all()

    def get_by_id(self, course_id: str) -> Optional[Course]:
        return self.db.query(Course).filter(Course.id == course_id).first()

    def create(self, name: str, color: Optional[str] = None) -> Course:
        course = Course(name=name, color=color)
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)
        return course

    def update(self, course: Course, **kwargs) -> Course:
        for key, value in kwargs.items():
            if hasattr(course, key) and value is not None:
                setattr(course, key, value)
        self.db.commit()
        self.db.refresh(course)
        return course

    def delete(self, course: Course) -> None:
        self.db.delete(course)
        self.db.commit()
