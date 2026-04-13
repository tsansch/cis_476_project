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

  async function handleAddCourse() {
    if (!name.trim()) return;

    try {
      const newCourse = await createCourse({ name });

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
      <h3>Course Tags</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Enter course name (e.g. CIS 476)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleAddCourse}>Add Course</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <ul>
          {courses.map((c) => (
            <li key={c.id} style={{ marginBottom: 10 }}>
              {editingId === c.id ? (
                <>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(c.id)}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  {c.name}

                  <button
                    onClick={() => startEdit(c)}
                    style={{ marginLeft: 10 }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCourse(c.id)}
                    style={{ marginLeft: 5 }}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

