from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db, init_db
from repository import TaskRepository, CourseRepository
from schemas import (
    TaskCreate, TaskUpdate, TaskResponse,
    CourseCreate, CourseUpdate, CourseResponse,
)
from service import toggle_task_complete
from factory import TaskFactory

app = FastAPI(title="Taskboard API")

from fastapi.responses import PlainTextResponse
import traceback

@app.exception_handler(Exception)
async def debug_exception_handler(request, exc):
    return PlainTextResponse(traceback.format_exc(), status_code=500)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()


# Task Endpoints
@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    sort_by: str = "due_date",
    course_id: Optional[str] = None,
    completed: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    repo = TaskRepository(db)
    return repo.get_all()

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: str, db: Session = Depends(get_db)):
    repo = TaskRepository(db)
    task = repo.get_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    repo = TaskRepository(db)
    task_fields = TaskFactory.create(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=task_data.due_date,
        course_id=task_data.course_id,
        is_recurring=getattr(task_data, "is_recurring", False),
        repeat_type=getattr(task_data, "repeat_type", None),  # pass repeat type into factory (4/14)
    )
    return repo.create(
        title=task_fields["title"],
        description=task_fields["description"],
        priority=task_fields["priority"],
        due_date=task_fields["due_date"],
        course_id=task_fields["course_id"],
        is_recurring=task_fields["is_recurring"],  # save recurring flag (4/14)
        repeat_type=task_fields["repeat_type"],  # save repeat type (4/14)
    )


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, task_data: TaskUpdate, db: Session = Depends(get_db)):
    repo = TaskRepository(db)
    task = repo.get_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    update_fields = task_data.model_dump(exclude_unset=True)
    return repo.update(task, **update_fields)


@app.patch("/tasks/{task_id}/complete", response_model=TaskResponse)
def mark_task_complete(task_id: str, db: Session = Depends(get_db)):
    updated = toggle_task_complete(db, task_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: str, db: Session = Depends(get_db)):
    repo = TaskRepository(db)
    task = repo.get_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    repo.delete(task)
    return None


# Course Endpoints
@app.get("/courses", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    repo = CourseRepository(db)
    return repo.get_all()


@app.get("/courses/{course_id}", response_model=CourseResponse)
def get_course(course_id: str, db: Session = Depends(get_db)):
    repo = CourseRepository(db)
    course = repo.get_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@app.post("/courses", response_model=CourseResponse, status_code=201)
def create_course(course_data: CourseCreate, db: Session = Depends(get_db)):
    repo = CourseRepository(db)
    return repo.create(name=course_data.name, color=course_data.color)


@app.put("/courses/{course_id}", response_model=CourseResponse)
def update_course(course_id: str, course_data: CourseUpdate, db: Session = Depends(get_db)):
    repo = CourseRepository(db)
    course = repo.get_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    update_fields = course_data.model_dump(exclude_unset=True)
    return repo.update(course, **update_fields)


@app.delete("/courses/{course_id}", status_code=204)
def delete_course(course_id: str, db: Session = Depends(get_db)):
    repo = CourseRepository(db)
    course = repo.get_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    repo.delete(course)
    return None
