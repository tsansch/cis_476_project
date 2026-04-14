// ProgressBar shows how many tasks are completed.
// For now, this is based on frontend state (backend later).
export default function ProgressBar({ total = 0, completed = 0 }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Progress</h3>
        <span className="badge">{percent}%</span>
      </div>

      <div className="muted" style={{ marginBottom: 10 }}>
        {completed} completed out of {total} tasks
      </div>

      <div style={{ height: 10, background: "#eef2ff", borderRadius: 999 }}>
        <div
          style={{
            height: 10,
            width: `${percent}%`,
            background: "var(--primary)",
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}
