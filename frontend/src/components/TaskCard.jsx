import { useState } from "react";

// TaskCard shows one task in the list.
export default function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  // Local edit states
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "Medium");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [courseTag, setCourseTag] = useState(task.courseTag || "");

  // NEW STATES
  const [taskType, setTaskType] = useState(task.type || "Normal");
  const [isRepeating, setIsRepeating] = useState(task.repeating || false);
  const [isUrgent, setIsUrgent] = useState(task.urgent || false);

  function priorityBadgeClass(p) {
    if (p === "High") return "badge badge-priority-high";
    if (p === "Medium") return "badge badge-priority-medium";
    if (p === "Low") return "badge badge-priority-low";
    return "badge";
  }

  function handleSave() {
    const updatedTask = {
      ...task,
      title: title.trim() || task.title,
      description: description.trim(),
      priority,
      dueDate,
      courseTag: courseTag.trim() || null,

      // NEW FIELDS
      type: taskType,
      repeating: isRepeating,
      urgent: isUrgent,
    };

    if (onUpdate) onUpdate(updatedTask);
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || "Medium");
    setDueDate(task.dueDate || "");
    setCourseTag(task.courseTag || "");

    setTaskType(task.type || "Normal");
    setIsRepeating(task.repeating || false);
    setIsUrgent(task.urgent || false);

    setIsEditing(false);
  }

  function handleToggleComplete() {
    if (!onUpdate) return;
    onUpdate({ ...task, completed: !task.completed });
  }

  return (
    <div
      className="task-card"
      style={{
        border:
          task.urgent || task.priority === "High"
            ? "2px solid red"
            : "1px solid #ccc",
        background:
          task.urgent || task.priority === "High"
            ? "#fff5f5"
            : "white",
      }}
    >
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
            <h4 style={{ margin: 0 }}>
              {task.completed ? `Completed: ${task.title}` : task.title}
            </h4>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={handleToggleComplete}>
                {task.completed ? "Undo" : "Complete"}
              </button>

              <button className="btn" onClick={() => setIsEditing(true)}>
                Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={() => onDelete && onDelete(task.id)}
              >
                Delete
              </button>
            </div>
          </div>

          {/* BADGES ROW */}
          <div className="task-meta-row" style={{ marginTop: 10 }}>
            {task.priority && (
              <span className={priorityBadgeClass(task.priority)}>
                Priority: {task.priority}
              </span>
            )}

            {task.dueDate && <span className="badge">Due: {task.dueDate}</span>}

            {task.courseTag && (
              <span className="badge">Course: {task.courseTag}</span>
            )}

            {/* NEW BADGES */}
            {task.type && (
              <span className="badge">Type: {task.type}</span>
            )}

            {task.repeating && (
              <span className="badge">🔁 Repeating</span>
            )}

            {task.urgent && (
              <span className="badge" style={{ background: "red", color: "white" }}>
                ⚠ Urgent
              </span>
            )}
          </div>

          {task.description && (
            <p style={{ marginTop: 10 }}>{task.description}</p>
          )}
        </>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Edit Task</h3>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>

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
                />
              </label>
            </div>

            {/* NEW EDIT FIELDS */}
            <label>
              Task Type
              <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                <option>Normal</option>
                <option>Exam</option>
                <option>Assignment</option>
                <option>Project</option>
              </select>
            </label>

            <label style={{ marginTop: 8 }}>
              <input
                type="checkbox"
                checked={isRepeating}
                onChange={(e) => setIsRepeating(e.target.checked)}
              />
              Repeating Task
            </label>

            <label>
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
              />
              Mark as Urgent
            </label>
          </div>
        </>
      )}
    </div>
  );
}
