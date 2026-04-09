import { useState } from "react";
import "./styles/app.css";

import TaskList from "./components/TaskList";
import WeeklyView from "./components/WeeklyView";
import CourseTag from "./components/CourseTag";

// App holds task state so Tasks and Weekly can see the same data.
export default function App() {
  const [view, setView] = useState("tasks");
  const [tasks, setTasks] = useState([]);

  function handleCreateTask(task) {
    const taskWithId = { ...task, id: crypto.randomUUID(), completed: false };
    setTasks((prev) => [taskWithId, ...prev]);
  }

  function handleUpdateTask(updatedTask) {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">
          <h2>Taskboard</h2>
          <div className="app-subtitle">Simple task planning and deadlines</div>
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
        {view === "tasks" && (
          <TaskList tasks={tasks} onCreateTask={handleCreateTask} onUpdateTask={handleUpdateTask} />
        )}

        {view === "weekly" && <WeeklyView tasks={tasks} />}

        {view === "courses" && <CourseTag />}
      </main>
    </div>
  );
}