function weekStartLabel(dateStr) {
  if (!dateStr) return "No due date";

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "No due date";

  // Start week on Monday
  const day = (d.getDay() + 6) % 7; // Mon=0, Sun=6
  d.setDate(d.getDate() - day);

  return d.toISOString().slice(0, 10); // YYYY-MM-DD (used for grouping + sorting)
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Display helper for the weekly card title
function formatWeekTitle(weekStartStr) {
  if (weekStartStr === "No due date") return "No due date";

  const d = new Date(weekStartStr);
  if (Number.isNaN(d.getTime())) return `Week of ${weekStartStr}`;

  // "Week of April 7"
  const pretty = d.toLocaleDateString(undefined, { month: "long", day: "numeric" });
  return `Week of ${pretty}`;
}

function priorityBadgeClass(priority) {
  if (priority === "High") return "badge badge-priority-high";
  if (priority === "Medium") return "badge badge-priority-medium";
  if (priority === "Low") return "badge badge-priority-low";
  return "badge";
}

export default function WeeklyView({ tasks = [] }) {
  if (tasks.length === 0) {
    return (
      <div>
        <h3 className="page-title">Weekly View</h3>
        <p className="muted">No tasks yet. Create a task to see it here.</p>
      </div>
    );
  }

  const grouped = tasks.reduce((acc, t) => {
    const key = weekStartLabel(t.dueDate);
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {});

  const keys = Object.keys(grouped).sort((a, b) => {
    if (a === "No due date") return 1;
    if (b === "No due date") return -1;
    return a.localeCompare(b);
  });

  return (
    <div>
      <h3 className="page-title">Weekly View</h3>

      <div className="page-grid">
        {keys.map((k) => {
          const count = grouped[k].length;

          return (
            <div key={k} className="card">
              <div className="card-header">
                <h3>{formatWeekTitle(k)}</h3>
                <span className="badge">
                  {count} {count === 1 ? "task" : "tasks"}
                </span>
              </div>

              <div className="task-list">
                {grouped[k]
                  .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
                  .map((t) => (
                    <div key={t.id} className={`task-card ${t.completed ? "task-completed" : ""}`}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <h4 className="task-card-title" style={{ margin: 0 }}>
                          {t.completed ? `Completed: ${t.title}` : t.title}
                        </h4>

                        {t.priority && (
                          <span className={priorityBadgeClass(t.priority)}>Priority: {t.priority}</span>
                          )}
                      </div>

                      <div className="task-card-meta" style={{ marginTop: 6 }}>
                        {t.dueDate && <span>Due: {formatDate(t.dueDate)}</span>}
                        {t.courseTag && (
                          <span>{t.dueDate ? " • " : ""}Course: {t.courseTag}</span>
                        )}
                      </div>

                      {t.description && (
                        <p className="task-card-desc" style={{ marginTop: 8 }}>
                          {t.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}