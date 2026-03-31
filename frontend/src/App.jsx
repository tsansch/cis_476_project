import { useState } from "react";
import "./styles/app.css";

import TaskList from "./components/TaskList";
import WeeklyView from "./components/WeeklyView";
import CourseTag from "./components/CourseTag";

// App is the main layout + navigation between screens.
export default function App() {
  const [view, setView] = useState("tasks");

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
        {view === "tasks" && <TaskList />}
        {view === "weekly" && <WeeklyView />}
        {view === "courses" && <CourseTag />}
      </main>
    </div>
  );
}