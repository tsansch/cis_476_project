import { useState, useEffect } from "react";
import "./styles/app.css";

import TaskList from "./components/TaskList";
import WeeklyView from "./components/WeeklyView";
import CourseTag from "./components/CourseTag";
import repeatStrategy from "./components/repeatStrategy";
import reminderService from "./components/reminderService";
import StatusBanner from "./components/StatusBanner";

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

  // FIXED DATE NORMALIZATION
  const toDateOnly = (dateStr) => {
    if (!dateStr) return null;

    const [year, month, day] = dateStr.split("T")[0].split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  // STATUS CALCULATION (FIXED)
  useEffect(() => {
    const listener = (tasksList) => {
      const today = new Date();
      const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const tomorrow = new Date(todayOnly);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const weekEnd = new Date(todayOnly);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const monthEnd = new Date(todayOnly);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const overdue = tasksList.filter((t) => {
        const d = toDateOnly(t.dueDate);
        return d && d < todayOnly && !t.completed;
      });

      const todayList = tasksList.filter((t) => {
        const d = toDateOnly(t.dueDate);
        return d && d.getTime() === todayOnly.getTime() && !t.completed;
      });

      const tomorrowList = tasksList.filter((t) => {
        const d = toDateOnly(t.dueDate);
        return d && d.getTime() === tomorrow.getTime() && !t.completed;
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

  // REPEATING TASK LOGIC
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
    }
  }

  async function handleUpdateTask(updatedTask) {
    try {
      const updated = await updateTask(updatedTask.id, updatedTask);
      const finalTask = transformTaskFromApi(updated);

      setTasks((prev) =>
        prev.map((t) => (t.id === finalTask.id ? finalTask : t))
      );

      const isRepeating = finalTask.repeating ?? updatedTask.repeating;
      const isCompleted = finalTask.completed;

      if (isCompleted && isRepeating) {
        const nextTask = generateNextTask(finalTask);

        if (nextTask) {
          const created = await createTask(nextTask);

          setTasks((prev) => [
            transformTaskFromApi(created),
            ...prev,
          ]);
        }
      }
    } catch (err) {
      setError("Failed to update task");
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError("Failed to delete task");
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
        <StatusBanner type="overdue" count={overdueTasks.length} tasks={overdueTasks} />
        <StatusBanner type="today" count={todayTasks.length} tasks={todayTasks} />
        <StatusBanner type="tomorrow" count={tomorrowTasks.length} tasks={tomorrowTasks} />
        <StatusBanner type="week" count={weekTasks.length} tasks={weekTasks} />
        <StatusBanner type="month" count={monthTasks.length} tasks={monthTasks} />

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {loading ? (
          <p>Loading tasks...</p>
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
