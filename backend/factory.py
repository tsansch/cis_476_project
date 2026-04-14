from models import Task
from typing import Optional
from datetime import date


class TaskFactory:
    @staticmethod
    def create(
        title: str,
        description: Optional[str] = None,
        priority: str = "Medium",
        due_date: Optional[date] = None,
        course_id: Optional[str] = None,
        is_recurring: bool = False,
    ) -> dict:
        if is_recurring:
            return TaskFactory._create_recurring(title, description, priority, due_date, course_id)
        return TaskFactory._create_standard(title, description, priority, due_date, course_id)

    @staticmethod
    def _create_standard(title, description, priority, due_date, course_id) -> dict:
        return {
            "title": title,
            "description": description,
            "priority": priority,
            "due_date": due_date,
            "course_id": course_id,
            "is_recurring": False,
        }

    @staticmethod
    def _create_recurring(title, description, priority, due_date, course_id) -> dict:
        return {
            "title": f"[Recurring] {title}",
            "description": description,
            "priority": priority,
            "due_date": due_date,
            "course_id": course_id,
            "is_recurring": True,
        }
