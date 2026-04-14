const API_BASE = "http://localhost:8000";

// ============ TASKS ============

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(taskData) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description || null,
      priority: taskData.priority || "Medium",
      due_date: taskData.dueDate || null,
      course_id: taskData.courseId || null,
      is_recurring: taskData.repeating || false,
    }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(taskId, taskData) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description || null,
      priority: taskData.priority || "Medium",
      due_date: taskData.dueDate || null,
      course_id: taskData.courseId || taskData.course_id || null,
      completed: taskData.completed,
      is_recurring: taskData.repeating || taskData.is_recurring || false,
    }),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function toggleTaskComplete(taskId) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/complete`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to toggle task completion");
  return res.json();
}

export async function deleteTask(taskId) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return true;
}

// ============ COURSES ============

export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
}

export async function createCourse(courseData) {
  const res = await fetch(`${API_BASE}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: courseData.name,
      color: courseData.color || null,
    }),
  });
  if (!res.ok) throw new Error("Failed to create course");
  return res.json();
}

export async function updateCourse(courseId, courseData) {
  const res = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: courseData.name,
      color: courseData.color || null,
    }),
  });
  if (!res.ok) throw new Error("Failed to update course");
  return res.json();
}

export async function deleteCourse(courseId) {
  const res = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete course");
  return true;
}

// ============ TRANSFORMERS ============

// Task formatting for frontend
export function transformTaskFromApi(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.due_date,
    completed: task.completed,
    courseTag: task.course?.name || null,
    courseId: task.course_id,
    repeating: task.is_recurring || false,
    urgent: task.priority === "High",
  };
}

// Course formatting for frontend
export function transformCourseFromApi(course) {
  return {
    id: course.id,
    name: course.name,
    color: course.color,
  };
}
