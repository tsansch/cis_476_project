import { useState } from "react";

export default function CourseTag({
  courses = [],
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
}) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState(null);

  function normalizeCourse(name) {
    return name.toLowerCase().replace(/\s+/g, "");
  }

  async function handleAddCourse() {
    if (!name.trim()) return;

    const normalizedInput = normalizeCourse(name);
    const existing = courses.find(
      (c) => normalizeCourse(c.name) === normalizedInput
    );

    if (existing) {
      setError("This course already exists");
      return;
    }

    try {
      setError(null);
      await onAddCourse(name);
      setName("");
    } catch (err) {
      setError("Failed to create course");
    }
  }

  async function handleDelete(id) {
    try {
      setError(null);
      await onDeleteCourse(id);
    } catch (err) {
      setError("Failed to delete course");
    }
  }

  function startEdit(course) {
    setEditingId(course.id);
    setEditValue(course.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function handleSaveEdit(id) {
    if (!editValue.trim()) return;

    try {
      setError(null);
      await onEditCourse(id, editValue.trim());
      setEditingId(null);
      setEditValue("");
    } catch (err) {
      setError("Failed to update course");
    }
  }

  return (
    <div>
      <h3 className="page-title">Course Tags</h3>

      {error && (
        <div className="error-banner" style={{ marginBottom: 16 }}>
          {error}
          <button className="btn" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Add New Course</h3>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              fontSize: 14,
            }}
            placeholder="Enter course name (e.g., CIS 476)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCourse()}
          />
          <button className="btn btn-primary" onClick={handleAddCourse}>
            Add Course
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <h3>Your Courses</h3>
          <span className="badge">{courses.length} courses</span>
        </div>

        {courses.length === 0 ? (
          <p className="muted">No courses yet. Add one above to get started.</p>
        ) : (
          <div className="task-list">
            {courses.map((c) => (
              <div
                key={c.id}
                className="task-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                }}
              >
                {editingId === c.id ? (
                  <div style={{ display: "flex", gap: 8, flex: 1 }}>
                    <input
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSaveEdit(c.id)
                      }
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSaveEdit(c.id)}
                    >
                      Save
                    </button>
                    <button className="btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>
                      {c.name}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn" onClick={() => startEdit(c)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}