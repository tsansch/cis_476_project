from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db, init_db
from repository import TaskRepository, CourseRepository
from schemas import (
    TaskCreate, TaskUpdate, TaskResponse,
    CourseCreate, CourseUpdate, CourseResponse,
)
from service import toggle_task_complete

app = FastAPI(title="Taskboard API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
def startup():
    """Initialize database on startup."""
    init_db()

# Task Endpoints
@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    """Get all tasks."""
    repo = TaskRepository(db)
    return repo.get_all()

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: str, db: Session = Depends(get_db)):
    """Get a single task by ID."""
    repo = TaskRepository(db)
    task = repo.get_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task."""
    repo = TaskRepository(db)
    return repo.create(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=task_data.due_date,
        course_id=task_data.course_id,
    )

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, task_data: TaskUpdate, db: Session = Depends(get_db)):
    """Update an existing task."""
    repo = TaskRepository(db)
    task = repo.get_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_fields = task_data.model_dump(exclude_unset=True)
    return repo.update(task, **update_fields)

# Endpoint to toggle task completion status
@app.patch("/tasks/{task_id}/complete", response_model=TaskResponse)
def mark_task_complete(task_id: str, db: Session = Depends(get_db)):
    updated = toggle_task_complete(db, task_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: str, db: Session = Depends(get_db)):
    """Delete a task."""
    repo = TaskRepository(db)
    task = repo.get_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    repo.delete(task)
    return None

# Course Endpoints
@app.get("/courses", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    """Get all courses."""
    repo = CourseRepository(db)
    return repo.get_all()

@app.get("/courses/{course_id}", response_model=CourseResponse)
def get_course(course_id: str, db: Session = Depends(get_db)):
    """Get a single course by ID."""
    repo = CourseRepository(db)
    course = repo.get_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.post("/courses", response_model=CourseResponse, status_code=201)
def create_course(course_data: CourseCreate, db: Session = Depends(get_db)):
    """Create a new course."""
    repo = CourseRepository(db)
    return repo.create(name=course_data.name, color=course_data.color)

@app.put("/courses/{course_id}", response_model=CourseResponse)
def update_course(course_id: str, course_data: CourseUpdate, db: Session = Depends(get_db)):
    """Update an existing course."""
    repo = CourseRepository(db)
    course = repo.get_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    update_fields = course_data.model_dump(exclude_unset=True)
    return repo.update(course, **update_fields)

@app.delete("/courses/{course_id}", status_code=204)
def delete_course(course_id: str, db: Session = Depends(get_db)):
    """Delete a course."""
    repo = CourseRepository(db)
    course = repo.get_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    repo.delete(course)
    return None
