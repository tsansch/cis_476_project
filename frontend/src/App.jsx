import { useState } from "react";
import TaskList from "./components/TaskList";
import WeeklyView from "./components/WeeklyView";
import CourseTag from "./components/CourseTag";
import "./styles/app.css";

// Main layout and page switcher. UI shell for now.
export default function App() {
  const [view, setView] = useState("tasks");

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Taskboard</h2>

        <nav style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setView("tasks")}>Tasks</button>
          <button onClick={() => setView("weekly")}>Weekly</button>
          <button onClick={() => setView("courses")}>Courses</button>
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