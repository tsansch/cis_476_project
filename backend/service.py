# Service layer for backend logic.

def toggle_task_complete(task_id: str):
    """
    Toggle a tasks completed status.
    
    This is a plaholder until the task model & repository layer are implemented.
    When those are ready this function will:
    1) Get the tasks from the repository by task_id
    2) Flip task.completed (T/F)
    3) Save the updatedtask back to the repository
    4) Return the updated task
    """
    raise NotImplementedError("toggle_task_complete is waiting on Task fields/repo.")