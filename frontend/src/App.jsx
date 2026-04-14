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

import reminderService from "./components/reminderService";

export default function App() {
  const [view, setView] = useState("tasks");

  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [overdueTasks, setOverdueTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [tomorrowTasks, setTomorrowTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState([]);
  const [monthTasks, setMonthTasks] = useState([]);

  useEffect(() => {
    loadTasks();
    loadCourses();
  }, []);

  useEffect(() => {
    reminderService.notify(tasks);
  }, [tasks]);

  const toDateOnly = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toISOString().split("T")[0];
  };

  useEffect(() => {
    const listener = (tasksList) => {
      const today = new Date().toISOString().split("T")[0];

      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = tomorrowDate.toISOString().split("T")[0];

      const weekEndDate = new Date();
      weekEndDate.setDate(weekEndDate.getDate() + 7);
      const weekEnd = weekEndDate.toISOString().split("T")[0];

      const monthEndDate = new Date();
      monthEndDate.setMonth(monthEndDate.getMonth() + 1);
      const monthEnd = monthEndDate.toISOString().split("T")[0];

      const overdue = tasksList.filter((t) => {
        const d = toDateOnly(t.dueDate);
        return d && d < today && !t.completed;
      });

      const todayList = tasksList.filter((t) => {
        const d = toDateOnly(t.dueDate);
        return d === today && !t.completed;
      });

      const tomorrowList = tasksList.filter((t) => {
        const d = toDateOnly(t.dueDate);
        return d === tomorrow && !t.completed;
      });

      const weekList = tasksList.filter((t) => {
        const d = toDateOnly(t.dueDate);
        return d && d > tomorrow && d <= weekEnd && !t.completed;
      });

      const monthList = tasksList.filter((t) => {
        const d = toDateOnly(t.dueDate);
        return d && d > weekEnd && d <= monthEnd && !t.completed;
      });

      setOverdueTasks(overdue);
      setTodayTasks(todayList);
      setTomorrowTasks(tomorrowList);
      setWeekTasks(weekList);
      setMonthTasks(monthList);
    };

    reminderService.subscribe(listener);
    return () => reminderService.unsubscribe(listener);
  }, []);

  // =========================
  // REPEATING TASK STRATEGY
  // =========================

  const repeatStrategy = {
    daily: (date) => {
      const d = new Date(date);
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    },

    weekly: (date) => {
      const d = new Date(date);
      d.setDate(d.getDate() + 7);
      return d.toISOString().split("T")[0];
    },

    monthly: (date) => {
      const d = new Date(date);
      d.setMonth(d.getMonth() + 1);
      return d.toISOString().split("T")[0];
    },
  };

  const generateNextTask = (task) => {
    if (!task.repeating || !task.repeatType) return null;

    const nextDateFn = repeatStrategy[task.repeatType];
    if (!nextDateFn) return null;

    return {
      ...task,
      id: undefined,
      completed: false,
      dueDate: nextDateFn(task.dueDate),
    };
  };

  function normalizeCourse(name) {
    return name.toLowerCase().replace(/\s+/g, "");
  }

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
      console.error(err);
    }
  }

  async function handleCreateTask(taskData) {
    try {
      let courseId = null;

      const rawCourse = taskData.courseTag?.trim();

      if (rawCourse) {
        const normalizedInput = normalizeCourse(rawCourse);

        const existing = courses.find(
          (c) => normalizeCourse(c.name) === normalizedInput
        );

        if (existing) {
          courseId = existing.id;
        } else {
          const res = await fetch("http://localhost:8000/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: rawCourse.toUpperCase().replace(/\s+/g, ""),
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
        courseId,
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
      // Handle course tag change
      let courseId = updatedTask.courseId;
      const rawCourse = updatedTask.courseTag?.trim();

      if (rawCourse) {
        const normalizedInput = normalizeCourse(rawCourse);
        const existing = courses.find(
          (c) => normalizeCourse(c.name) === normalizedInput
        );

        if (existing) {
          courseId = existing.id;
        } else {
          // Create new course if it doesn't exist
          const res = await fetch("http://localhost:8000/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: rawCourse.toUpperCase().replace(/\s+/g, ""),
            }),
          });
          const newCourse = await res.json();
          courseId = newCourse.id;
          setCourses((prev) => [...prev, transformCourseFromApi(newCourse)]);
        }
      } else {
        courseId = null;
      }

      const updated = await updateTask(updatedTask.id, {
        ...updatedTask,
        courseId,
        course_id: courseId,
      });

      const finalTask = {
        ...transformTaskFromApi(updated),
        repeating: updatedTask.repeating || updated.is_recurring || false,
        repeatType: updatedTask.repeatType || null,
      };

      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? finalTask : t))
      );

      // Handle repeating tasks
      if (finalTask.completed === true && finalTask.repeating === true) {
        const nextTask = generateNextTask(finalTask);

        if (nextTask) {
          const created = await createTask({
            ...nextTask,
            courseId,
          });

          setTasks((prev) => [transformTaskFromApi(created), ...prev]);
        }
      }
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
          <button className={`tab-btn ${view === "tasks" ? "active" : ""}`} onClick={() => setView("tasks")}>Tasks</button>
          <button className={`tab-btn ${view === "weekly" ? "active" : ""}`} onClick={() => setView("weekly")}>Weekly</button>
          <button className={`tab-btn ${view === "courses" ? "active" : ""}`} onClick={() => setView("courses")}>Courses</button>
        </nav>
      </header>

      <main>
        {overdueTasks.length > 0 && (
          <div className="reminder-banner">
            <strong>Reminder:</strong> You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}!
            <span style={{ marginLeft: 8, color: "#6b7280" }}>
              ({overdueTasks.map(t => t.title).join(", ")})
            </span>
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
            <button className="btn" onClick={() => setError(null)}>Dismiss</button>
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

            {view === "courses" && <CourseTag courses={courses} />}
          </>
        )}
      </main>
    </div>
  );
}
