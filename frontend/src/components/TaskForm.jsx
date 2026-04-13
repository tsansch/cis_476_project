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
  const [repeatType, setRepeatType] = useState("weekly");
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

      // TYPE
      type: taskType,

      // ✅ REPEATING SYSTEM (THIS IS THE FIX)
      repeating: isRepeating,
      repeatType: isRepeating ? repeatType : null,

      // URGENT
      urgent: !!isUrgent,
    };

    if (onCreate) onCreate(newTask);

    // RESET ALL FIELDS
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setCourseTag("");
    setTaskType("Normal");
    setIsRepeating(false);
    setRepeatType("weekly");
    setIsUrgent(false);
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>Create Task</h3>

      {error && <div className="task-form-error">{error}</div>}

      {/* TITLE */}
      <label>
        Title *
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Finish CIS 476 Project"
        />
      </label>

      {/* DESCRIPTION */}
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>

      {/* PRIORITY + DATE */}
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

      {/* COURSE */}
      <label>
        Course tag
        <input
          value={courseTag}
          onChange={(e) => setCourseTag(e.target.value)}
        />
      </label>

      {/* TASK TYPE */}
      <label>
        Task Type
        <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
          <option>Normal</option>
          <option>Exam</option>
          <option>Assignment</option>
          <option>Project</option>
        </select>
      </label>

      {/* REPEATING */}
      <label style={{ marginTop: 10 }}>
        <input
          type="checkbox"
          checked={isRepeating}
          onChange={(e) => setIsRepeating(e.target.checked)}
        />
        Repeating Task
      </label>

      {/* REPEAT TYPE */}
      {isRepeating && (
        <label>
          Repeat Every
          <select
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
      )}

      {/* URGENT */}
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
