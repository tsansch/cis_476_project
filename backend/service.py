from sqlalchemy.orm import Session
from repository import TaskRepository

# Service layer for backend logic.
# Routes should call functions here so business logic stays in one place.

def toggle_task_complete(db: Session, task_id: str):
    """
    Toggle a task's completed status.

    Steps:
    1) Load the task from the repository
    2) Flip completed (True/False)
    3) Save and return the updated task
    """
    repo = TaskRepository(db)
    task = repo.get_by_id(task_id)

    if not task:
        return None

    return repo.toggle_complete(task)