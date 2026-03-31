from fastapi import FastAPI, HTTPException
from service import toggle_task_complete

# Backend entry point for taskboard.
# Im starting w/ just the endpoints we need & we can build from there
app = FastAPI(title = "Taskboard API")

@app.patch("/tasks/{task_id}/complete")
def mark_task_complete(task_id: str):
    """
    Track Progress (Backend): mark a task as complete or undo it.

    For now, this endpoint is wired up but not fully implemented yet.
    Once the Task fields + repository are finished, this will:
      1) load the task by id
      2) flip the completed value
      3) save the task
      4) return the updated task
    """
    try:
        return toggle_task_complete(task_id)
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e))