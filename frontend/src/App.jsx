import { useState, useEffect } from "react";
import "./styles/app.css";

import TaskList from "./components/TaskList";
import WeeklyView from "./components/WeeklyView";
import CourseTag from "./components/CourseTag";

import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchCourses,
  transformTaskFromApi,
  transformCourseFromApi,
} from "./api";

export default function App() {
  const [view, setView] = useState("tasks");

  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
    loadCourses();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data.map(transformTaskFromApi));
    } catch (err) {
      setError("Failed to load tasks. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCourses() {
    try {
      const data = await fetchCourses();
      setCourses(data.map(transformCourseFromApi));
    } catch (err) {
      console.error("Failed to load courses", err);
    }
  }

  // IMPORTANT FIX IS HERE
  async function handleCreateTask(taskData) {
    try {
      let courseId = null;

      if (taskData.courseTag && taskData.courseTag.trim() !== "") {
        const existing = courses.find(
          (c) =>
            c.name.toLowerCase().trim() ===
            taskData.courseTag.toLowerCase().trim()
        );

        if (existing) {
          courseId = existing.id;
        } else {
          const res = await fetch("http://localhost:8000/courses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: taskData.courseTag,
            }),
          });

          const newCourse = await res.json();

          courseId = newCourse.id;

          setCourses((prev) => [
            ...prev,
            transformCourseFromApi(newCourse),
          ]);
        }
      }

      const created = await createTask({
        ...taskData,
        courseId: courseId,
      });

      setTasks((prev) => [
        transformTaskFromApi(created),
        ...prev,
      ]);
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
    }
  }

  async function handleUpdateTask(updatedTask) {
    try {
      const updated = await updateTask(updatedTask.id, updatedTask);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === updated.id ? transformTaskFromApi(updated) : t
        )
      );
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">
          <h2>Taskboard</h2>
          <div className="app-subtitle">
            Simple task planning and deadlines
          </div>
        </div>

        <nav className="tabs">
          <button
            className={`tab-btn ${view === "tasks" ? "active" : ""}`}
            onClick={() => setView("tasks")}
          >
            Tasks
          </button>

          <button
            className={`tab-btn ${view === "weekly" ? "active" : ""}`}
            onClick={() => setView("weekly")}
          >
            Weekly
          </button>

          <button
            className={`tab-btn ${view === "courses" ? "active" : ""}`}
            onClick={() => setView("courses")}
          >
            Courses
          </button>
        </nav>
      </header>

      <main>
        {error && (
          <div className="error-banner">
            {error}
            <button
              className="btn"
              onClick={() => setError(null)}
              style={{ marginLeft: 12 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <p className="muted">Loading tasks...</p>
        ) : (
          <>
            {view === "tasks" && (
              <TaskList
                tasks={tasks}
                courses={courses}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {view === "weekly" && <WeeklyView tasks={tasks} />}

            {view === "courses" && (
              <CourseTag courses={courses} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
