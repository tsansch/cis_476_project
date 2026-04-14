from sqlalchemy.orm import Session
from .repository import TaskRepository
from .strategies import SortByDueDate, SortByPriority, GroupByCourse
from typing import Optional


STRATEGIES = {
    "due_date": SortByDueDate(),
    "priority": SortByPriority(),
    "course": GroupByCourse(),
}


def toggle_task_complete(db: Session, task_id: str):
    repo = TaskRepository(db)
    task = repo.get_by_id(task_id)
    if not task:
        return None
    return repo.toggle_complete(task)


def get_sorted_filtered_tasks(
    db: Session,
    sort_by: str = "due_date",
    course_id: Optional[str] = None,
    completed: Optional[bool] = None,
):
    repo = TaskRepository(db)
    tasks = repo.get_all()

    if course_id:
        tasks = [t for t in tasks if t.course_id == course_id]

    if completed is not None:
        tasks = [t for t in tasks if t.completed == completed]

    strategy = STRATEGIES.get(sort_by, SortByDueDate())
    return strategy.apply(tasks)