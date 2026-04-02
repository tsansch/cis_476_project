from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

# Course Schemas
class CourseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")

class CourseResponse(CourseBase):
    # Schema for course in API responses
    id: str

    class Config:
        from_attributes = True


# Task Schemas
class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    priority: str = Field(default="Medium", pattern=r"^(Low|Medium|High)$")
    due_date: Optional[date] = None
    course_id: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    priority: Optional[str] = Field(None, pattern=r"^(Low|Medium|High)$")
    due_date: Optional[date] = None
    course_id: Optional[str] = None
    completed: Optional[bool] = None


class TaskResponse(TaskBase):
    id: str
    completed: bool
    course: Optional[CourseResponse] = None

    class Config:
        from_attributes = True
