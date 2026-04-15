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
  createCourse,
  updateCourse,
  deleteCourse,
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

  const [dismissedBanners, setDismissedBanners] = useState({
    overdue: false,
    today: false,
    tomorrow: false,
    week: false,
    month: false,
  }); // tracks closed banners (4/14)

  useEffect(() => {
    loadTasks();
    loadCourses();
  }, []);

  useEffect(() => {
    reminderService.notify(tasks);
  }, [tasks]);

    function handleDismissBanner(type) {
    setDismissedBanners((prev) => ({
      ...prev,
      [type]: true,
    })); // hides only the selected banner (4/14)
  }

  useEffect(() => {
    setDismissedBanners((prev) => ({
      overdue: overdueTasks.length > 0 ? prev.overdue : false,
      today: todayTasks.length > 0 ? prev.today : false,
      tomorrow: tomorrowTasks.length > 0 ? prev.tomorrow : false,
      week: weekTasks.length > 0 ? prev.week : false,
      month: monthTasks.length > 0 ? prev.month : false,
    })); // resets a banner when that alert type disappears 
  }, [
    overdueTasks.length,
    todayTasks.length,
    tomorrowTasks.length,
    weekTasks.length,
    monthTasks.length,
  ]);

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

  // Add course creation logic (4/14)
  async function handleAddCourse(name) {
  if (!name.trim()) return;

  const normalizedInput = normalizeCourse(name);
  const existing = courses.find(
    (c) => normalizeCourse(c.name) === normalizedInput
  );

  if (existing) return existing;

  const newCourse = await createCourse({
    name: name.trim().toUpperCase().replace(/\s+/g, " "),
  });

  const transformed = transformCourseFromApi(newCourse);

  setCourses((prev) => [...prev, transformed]);
  return transformed;
}

async function handleEditCourse(id, name) {
  try {
    const updated = await updateCourse(id, { name: name.trim() });
    const transformed = transformCourseFromApi(updated);

    setCourses((prev) =>
      prev.map((c) => (c.id === id ? transformed : c))
    );
  } catch (err) {
    setError("Failed to update course");
    console.error(err);
  }
}

async function handleDeleteCourse(courseId) {
  try {
    await deleteCourse(courseId);

    setCourses((prev) => prev.filter((c) => c.id !== courseId));

    setTasks((prev) =>
      prev.map((t) =>
        t.courseId === courseId
          ? { ...t, courseId: null, courseTag: null }
          : t
      )
    );
  } catch (err) {
    setError("Failed to delete course");
    console.error(err);
  }
}
  
  async function handleCreateTask(taskData) {
  try {
    let courseId = taskData.courseId; 
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
        courseId = newCourse.id; // save the new course id
        setCourses((prev) => [...prev, transformCourseFromApi(newCourse)]); // add new course to frontend state
      }
    } else {
      courseId = null; // clear course if no tag provided
    }

    const created = await createTask({
      ...taskData,
      courseId,
    });

    setTasks((prev) => [transformTaskFromApi(created), ...prev]);
  } catch (err) {
    setError("Failed to create task");
    console.error(err);
  }
}

async function handleUpdateTask(updatedTask) {
  try {
    const existingTask = tasks.find((t) => t.id === updatedTask.id); // get the old version before updating

    let courseId = updatedTask.courseId;
    const rawCourse = updatedTask.courseTag?.trim();

    if (rawCourse) {
      const normalizedInput = normalizeCourse(rawCourse);
      const existing = courses.find(
        (c) => normalizeCourse(c.name) === normalizedInput
      );

      if (existing) {
        courseId = existing.id; // use existing course if it already exists
      } else {
        const res = await fetch("http://localhost:8000/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: rawCourse.toUpperCase().replace(/\s+/g, ""),
          }),
        });

        const newCourse = await res.json();
        courseId = newCourse.id; // save the new course id
        setCourses((prev) => [...prev, transformCourseFromApi(newCourse)]); // add new course to frontend state
      }
    } else {
      courseId = null; // clear course if user removed it
    }

    const updated = await updateTask(updatedTask.id, {
      ...updatedTask,
      courseId,
      course_id: courseId,
    });

    const finalTask = {
      ...transformTaskFromApi(updated),
      repeating: updatedTask.repeating ?? updated.is_recurring ?? false, // keep recurring value after update
      repeatType: updatedTask.repeatType ?? updated.repeat_type ?? null, // keep repeat type after update
    };

    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? finalTask : t))
    ); // replace old task in state with the updated task

    const justCompleted =
      existingTask &&
      existingTask.completed === false &&
      finalTask.completed === true; // only run recurring logic when task changes from incomplete to complete

    if (justCompleted && finalTask.repeating && finalTask.repeatType) {
      const nextTask = generateNextTask(finalTask); // build the next recurring task

      if (nextTask) {
        const created = await createTask({
          ...nextTask,
          courseId,
        });

        setTasks((prev) => [transformTaskFromApi(created), ...prev]); // add the next recurring task to the list
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
        
                {!dismissedBanners.overdue && (
          <StatusBanner
            type="overdue"
            count={overdueTasks.length}
            tasks={overdueTasks}
            onDismiss={() => handleDismissBanner("overdue")}
          />
        )}

        {!dismissedBanners.today && (
          <StatusBanner
            type="today"
            count={todayTasks.length}
            tasks={todayTasks}
            onDismiss={() => handleDismissBanner("today")}
          />
        )}

        {!dismissedBanners.tomorrow && (
          <StatusBanner
            type="tomorrow"
            count={tomorrowTasks.length}
            tasks={tomorrowTasks}
            onDismiss={() => handleDismissBanner("tomorrow")}
          />
        )}

        {!dismissedBanners.week && (
          <StatusBanner
            type="week"
            count={weekTasks.length}
            tasks={weekTasks}
            onDismiss={() => handleDismissBanner("week")}
          />
        )}

        {!dismissedBanners.month && (
          <StatusBanner
            type="month"
            count={monthTasks.length}
            tasks={monthTasks}
            onDismiss={() => handleDismissBanner("month")}
          />
        )}

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
        
            {view === "courses" && (
              <CourseTag
                courses={courses}
                onAddCourse={handleAddCourse}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
  }