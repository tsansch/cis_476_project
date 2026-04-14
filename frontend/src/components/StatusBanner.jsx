export default function StatusBanner({ type, count, tasks }) {
  if (!count) return null;

  const styles = {
    overdue: {
      background: "#ff4d4d",
      color: "white",
    },
    today: {
      background: "#ff8c00",
      color: "white",
    },
    tomorrow: {
      background: "#ffd24d",
      color: "black",
    },
    week: {
      background: "#4CAF50",
      color: "white",
    },
    month: {
      background: "#4da6ff",
      color: "white",
    },
  };

  const labels = {
    overdue: "Overdue",
    today: "Due Today",
    tomorrow: "Due Tomorrow",
    week: "Due This Week",
    month: "Due This Month",
  };

  return (
    <div style={{ ...styles[type], padding: 10, marginBottom: 8 }}>
      <strong>
        {labels[type]}: {count}
      </strong>

      {tasks?.length > 0 && (
        <span style={{ marginLeft: 8, opacity: 0.8 }}>
          ({tasks.map((t) => t.title).join(", ")})
        </span>
      )}
    </div>
  );
}
