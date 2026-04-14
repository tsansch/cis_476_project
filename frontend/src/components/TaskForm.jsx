import { useState } from "react";

export default function TaskForm({ onCreate, courses = [] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [courseTag, setCourseTag] = useState("");
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatType, setRepeatType] = useState("weekly");
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
      repeating: isRepeating,
      repeatType: isRepeating ? repeatType : null,
      urgent: priority === "High",
    };

    if (onCreate) onCreate(newTask);

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setCourseTag("");
    setIsRepeating(false);
    setRepeatType("weekly");
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

      <div className="task-form-row">
        <label>
          Course tag
          {courses.length > 0 ? (
            <select
              value={courseTag}
              onChange={(e) => setCourseTag(e.target.value)}
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={courseTag}
              onChange={(e) => setCourseTag(e.target.value)}
              placeholder="e.g., CIS 476"
            />
          )}
        </label>

        <label>
          Repeating
          <select
            value={isRepeating ? repeatType : "none"}
            onChange={(e) => {
              if (e.target.value === "none") {
                setIsRepeating(false);
              } else {
                setIsRepeating(true);
                setRepeatType(e.target.value);
              }
            }}
          >
            <option value="none">No repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        Create task
      </button>
    </form>
  );
}
