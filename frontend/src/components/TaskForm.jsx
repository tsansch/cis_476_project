import { useState } from "react";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [courseTag, setCourseTag] = useState("");

  // NEW STATES
  const [taskType, setTaskType] = useState("Normal");
  const [isRepeating, setIsRepeating] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

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

      // NEW FIELDS
      type: taskType,
      repeating: isRepeating,
      urgent: isUrgent,
    };

    if (onCreate) onCreate(newTask);

    // RESET
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setCourseTag("");
    setTaskType("Normal");
    setIsRepeating(false);
    setIsUrgent(false);
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

      {/* NEW: TASK TYPE */}
      <label>
        Task Type
        <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
          <option>Normal</option>
          <option>Exam</option>
          <option>Assignment</option>
          <option>Project</option>
        </select>
      </label>

      {/* NEW: REPEATING */}
      <label style={{ marginTop: 10 }}>
        <input
          type="checkbox"
          checked={isRepeating}
          onChange={(e) => setIsRepeating(e.target.checked)}
        />
        Repeating Task
      </label>

      {/* NEW: URGENT */}
      <label>
        <input
          type="checkbox"
          checked={isUrgent}
          onChange={(e) => setIsUrgent(e.target.checked)}
        />
        Mark as Urgent
      </label>

      <button type="submit" className="btn btn-primary">
        Create task
      </button>
    </form>
  );
}