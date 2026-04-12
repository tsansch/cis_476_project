import { useEffect, useState } from "react";

export default function CourseTag() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const res = await fetch("http://127.0.0.1:8000/courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses", err);
    }
  }

  return (
    <div>
      <h3>Course Tags</h3>

      {courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              {course.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
