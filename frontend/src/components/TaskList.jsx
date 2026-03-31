import { useState } from "react";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import ProgressBar from "./ProgressBar";
import TaskCard from "./TaskCard";

// TaskList shows the main task page: create tasks and view them in a list.
// No backend yet, so tasks are stored in React state for now.
export default function TaskList() {
  const [tasks, setTasks] = useState([]);

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

  return (
    <div>
      <h3 className="page-title">Tasks</h3>

      <FilterBar />

      <div className="card" style={{ marginTop: 12 }}>
        <TaskForm onCreate={handleCreateTask} />
      </div>

      <div style={{ marginTop: 16 }}>
        <ProgressBar total={tasks.length} completed={completedCount} />      </div>

      <h4 style={{ marginTop: 16, marginBottom: 8 }}>Task List</h4>

      {tasks.length === 0 ? (
        <p className="muted">No tasks yet. Add one above.</p>
      ) : (
        <div className="task-list">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onUpdate={handleUpdateTask} />
          ))}
        </div>
      )}
    </div>
  );
}