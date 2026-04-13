import { useEffect, useState } from "react";
import { fetchCourses, createCourse, transformCourseFromApi } from "../api";

export default function CourseTag() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchCourses();

      // IMPORTANT FIX: normalize backend data
      setCourses(data.map(transformCourseFromApi));
    } catch (err) {
      console.error(err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCourse() {
    if (!name.trim()) return;

    try {
      const newCourse = await createCourse({ name });

      // FIX: ensure consistent format
      setCourses((prev) => [
        ...prev,
        transformCourseFromApi(newCourse),
      ]);

      setName("");
    } catch (err) {
      console.error(err);
      setError("Failed to create course");
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
        <button onClick={handleAddCourse}>
          Add Course
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <ul>
          {courses.map((c) => (
            <li key={c.id}>
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
