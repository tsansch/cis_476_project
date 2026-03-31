import { useState } from "react";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import ProgressBar from "./ProgressBar";
import TaskCard from "./TaskCard";

// TaskList shows the main task page: create tasks and view them in a list.
// No backend yet, so tasks are stored in React state for now.
export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  // Sort + filter settings for the list
  const [filters, setFilters] = useState({
    status: "all",     // all | active | completed
    priority: "all",   // all | Low | Medium | High
    course: "",        // text search
    sort: "dueAsc",    // dueAsc | dueDesc | priority
  });

  function handleCreateTask(task) {
    // Add an id so we can render each task cleanly
    const taskWithId = { ...task, id: crypto.randomUUID(), completed: false };
    setTasks((prev) => [taskWithId, ...prev]);
  }

  function handleUpdateTask(updatedTask) {
    // Replace the task in the list with the updated version
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  // Apply filters + sorting to produce what we actually render
  const filteredTasks = [...tasks]
    .filter((t) => {
      if (filters.status === "all") return true;
      if (filters.status === "active") return !t.completed;
      return t.completed; // completed
    })
    .filter((t) => {
      if (filters.priority === "all") return true;
      return t.priority === filters.priority;
    })
    .filter((t) => {
      const q = filters.course.trim().toLowerCase();
      if (!q) return true;
      return (t.courseTag || "").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (filters.sort === "dueAsc") {
        return (a.dueDate || "").localeCompare(b.dueDate || "");
      }
      if (filters.sort === "dueDesc") {
        return (b.dueDate || "").localeCompare(a.dueDate || "");
      }
      if (filters.sort === "priority") {
        const rank = { High: 3, Medium: 2, Low: 1 };
        return (rank[b.priority] || 0) - (rank[a.priority] || 0);
      }
      return 0;
    });

  return (
    <div>
      <h3 className="page-title">Tasks</h3>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="card" style={{ marginTop: 12 }}>
        <TaskForm onCreate={handleCreateTask} />
      </div>

      <div style={{ marginTop: 16 }}>
        <ProgressBar total={tasks.length} completed={completedCount} />
      </div>

      <h4 style={{ marginTop: 16, marginBottom: 8 }}>Task List</h4>

      {filteredTasks.length === 0 ? (
        <p className="muted">No tasks match your filters yet.</p>
      ) : (
        <div className="task-list">
          {filteredTasks.map((t) => (
            <TaskCard key={t.id} task={t} onUpdate={handleUpdateTask} />
          ))}
        </div>
      )}
    </div>
  );
}