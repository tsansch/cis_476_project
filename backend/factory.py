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
        repeat_type: Optional[str] = None,  # stores daily, weekly, or monthly (4/14)
    ) -> dict:
        if is_recurring:
            return TaskFactory._create_recurring(
                title,
                description,
                priority,
                due_date,
                course_id,
                repeat_type # pass repeat type into recurring factory (4/14)
            )
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
            "repeat_type": None,  # standard tasks do not repeat (4/14)
        }

    @staticmethod
    def _create_recurring(title, description, priority, due_date, course_id, repeat_type) -> dict:
        return {
            "title": title, # keep the title clean (4/14)
            "description": description,
            "priority": priority,
            "due_date": due_date,
            "course_id": course_id,
            "is_recurring": True,
            "repeat_type": repeat_type,  # store the repeat type for recurring tasks (4/14)
        }
