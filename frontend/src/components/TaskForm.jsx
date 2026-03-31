import { useState } from "react";

// TaskForm lets the user enter a new task.
// ** The backend is not ready yet, so tasks are stored in frontend for now. **
export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [courseTag, setCourseTag] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!dueDate) {
      setError("Please choose a due date.");
      return;
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      courseTag: courseTag.trim() || null,
    };

    // Send the new task to the parent component (TaskList)
    if (onCreate) onCreate(newTask);

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setCourseTag("");
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>Create Task</h3>

      {error && <div className="task-form-error">{error}</div>}

      <label>
        Title *
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Finish CIS 476 Project"
        />
      </label>

      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional notes..."
          rows={3}
        />
      </label>

      <div className="task-form-row">
        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <label>
          Due date *
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
      </div>

      <label>
        Course tag
        <input
          value={courseTag}
          onChange={(e) => setCourseTag(e.target.value)}
          placeholder="e.g., CIS 476"
        />
      </label>

      <button type="submit" className="btn btn-primary">Create task</button>
    </form>
  );
}