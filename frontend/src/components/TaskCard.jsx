import { useState } from "react";

// TaskCard shows one task in the list.
// This adds edit controls and a complete toggle. Backend comes later.
export default function TaskCard({ task, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  // Local fields used while editing
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "Medium");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [courseTag, setCourseTag] = useState(task.courseTag || "");

  function handleSave() {
    const updatedTask = {
      ...task,
      title: title.trim() || task.title,
      description: description.trim(),
      priority,
      dueDate,
      courseTag: courseTag.trim() || null,
    };

    if (onUpdate) onUpdate(updatedTask);
    setIsEditing(false);
  }

  function handleCancel() {
    // Reset edits back to original task values
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || "Medium");
    setDueDate(task.dueDate || "");
    setCourseTag(task.courseTag || "");
    setIsEditing(false);
  }

  function handleToggleComplete() {
    if (!onUpdate) return;
    onUpdate({ ...task, completed: !task.completed });
  }

  return (
    <div className="task-card">
      {!isEditing ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              gap: 10,
            }}
          >
            <h4 className="task-card-title" style={{ margin: 0 }}>
              {task.completed ? `✅ ${task.title}` : task.title}
            </h4>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" type="button" onClick={handleToggleComplete}>
                {task.completed ? "Undo" : "Complete"}
              </button>

              <button className="btn" type="button" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            </div>
          </div>

          <div className="task-card-meta">
            {task.dueDate && <span>Due: {task.dueDate}</span>}
            {task.courseTag && (
              <span>{task.dueDate ? " • " : ""}Course: {task.courseTag}</span>
            )}
            {task.priority && (
              <span>
                {(task.dueDate || task.courseTag) ? " • " : ""}Priority: {task.priority}
              </span>
            )}
          </div>

          {task.description && <p className="task-card-desc">{task.description}</p>}
        </>
      ) : (
        <>
          <div className="card-header" style={{ alignItems: "center" }}>
            <h3>Edit Task</h3>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" type="button" onClick={handleSave}>
                Save
              </button>
              <button className="btn" type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>

          {/* Embedded form layout (no extra card border/padding inside TaskCard) */}
          <div className="task-form task-form--embedded">
            <div className="task-form-row">
              <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>

              <label>
                Due date
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </label>
            </div>

            <label>
              Description
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes..."
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
                Course tag
                <input
                  value={courseTag}
                  onChange={(e) => setCourseTag(e.target.value)}
                  placeholder="e.g., CIS 476"
                />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}