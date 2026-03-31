// TaskCard displays one task on the Task List page.
// Buttons (edit/delete/complete) will be added later.
export default function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h4 className="task-card-title">{task.title}</h4>

      <div className="task-card-meta">
        {task.dueDate && <span>Due: {task.dueDate}</span>}
        {task.courseTag && <span>{task.dueDate ? " • " : ""}Course: {task.courseTag}</span>}
        {task.priority && (
          <span>{(task.dueDate || task.courseTag) ? " • " : ""}Priority: {task.priority}</span>
        )}
      </div>

      {task.description && <p className="task-card-desc">{task.description}</p>}
    </div>
  );
}