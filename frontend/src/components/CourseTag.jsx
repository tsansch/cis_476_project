import { useEffect, useState } from "react";
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  transformCourseFromApi,
} from "../api";

export default function CourseTag() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      const data = await fetchCourses();
      setCourses(data.map(transformCourseFromApi));
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  function normalizeCourse(name) {
    return name.toLowerCase().replace(/\s+/g, "");
  }

  async function handleAddCourse() {
    if (!name.trim()) return;

    // Check for duplicates
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
      const newCourse = await createCourse({ 
        name: name.trim().toUpperCase().replace(/\s+/g, " ") 
      });

      setCourses((prev) => [
        ...prev,
        transformCourseFromApi(newCourse),
      ]);

      setName("");
    } catch (err) {
      setError("Failed to create course");
    }
  }

  async function handleDeleteCourse(id) {
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
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
    try {
      const updated = await updateCourse(id, { name: editValue });

      setCourses((prev) =>
        prev.map((c) =>
          c.id === id ? transformCourseFromApi(updated) : c
        )
      );

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
          <button className="btn" onClick={() => setError(null)}>Dismiss</button>
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
              fontSize: 14
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

        {loading ? (
          <p className="muted">Loading...</p>
        ) : courses.length === 0 ? (
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
                  padding: 12
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
                        fontSize: 14
                      }}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(c.id)}
                    />
                    <button className="btn btn-primary" onClick={() => handleSaveEdit(c.id)}>
                      Save
                    </button>
                    <button className="btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>{c.name}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn" onClick={() => startEdit(c)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDeleteCourse(c.id)}>
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
