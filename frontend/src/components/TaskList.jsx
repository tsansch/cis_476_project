import { useState } from "react";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import ProgressBar from "./ProgressBar";
import TaskCard from "./TaskCard";

// TaskList shows the Tasks page.
// Tasks come from App so Weekly View can use the same list.
export default function TaskList({ tasks, courses = [], onCreateTask, onUpdateTask, onDeleteTask }) {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    course: "",
    sort: "dueAsc",
  });

  const [groupByCourse, setGroupByCourse] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = [...tasks]
    .filter((t) => {
      if (filters.status === "all") return true;
      if (filters.status === "active") return !t.completed;
      return t.completed;
    })
    .filter((t) =>
      filters.priority === "all" ? true : t.priority === filters.priority
    )

    // FIXED FILTER (SAFE + CONSISTENT)
    .filter((t) => {
      const q = filters.course.trim().toLowerCase();
      if (!q) return true;

      const courseName = (
        t.course?.name ||
        t.courseTag ||
        ""
      ).toLowerCase();

      return courseName.includes(q);
    })

    .sort((a, b) => {
      if (filters.sort === "dueAsc")
        return (a.dueDate || "").localeCompare(b.dueDate || "");

      if (filters.sort === "dueDesc")
        return (b.dueDate || "").localeCompare(a.dueDate || "");

      if (filters.sort === "priority") {
        const rank = { High: 3, Medium: 2, Low: 1 };
        return (rank[b.priority] || 0) - (rank[a.priority] || 0);
      }

      return 0;
    });

  // FIXED GROUPING (SAFE + MATCHES FILTER)
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const courseName =
      task.course?.name ||
      task.courseTag ||
      "No Course";

    if (!acc[courseName]) acc[courseName] = [];
    acc[courseName].push(task);

    return acc;
  }, {});

  return (
    <div>
      <h3 className="page-title">Tasks</h3>

      <FilterBar 
        filters={filters} 
        onChange={setFilters}
        groupByCourse={groupByCourse}
        onToggleGroup={() => setGroupByCourse(!groupByCourse)}
      />

      <div className="card" style={{ marginTop: 12 }}>
        <TaskForm onCreate={onCreateTask} courses={courses} />
      </div>

      <div style={{ marginTop: 16 }}>
        <ProgressBar total={tasks.length} completed={completedCount} />
      </div>

      <h4 style={{ marginTop: 16, marginBottom: 8 }}>Task List</h4>

      {filteredTasks.length === 0 ? (
        <p className="muted">No tasks match your filters yet.</p>
      ) : groupByCourse ? (
        Object.entries(groupedTasks).map(([course, tasks]) => (
          <div key={course} style={{ marginBottom: 20 }}>
            <h4>{course}</h4>

            <div className="task-list">
              {tasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="task-list">
          {filteredTasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
