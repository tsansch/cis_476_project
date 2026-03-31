// FilterBar controls sorting and filtering for the task list.
export default function FilterBar({ filters, onChange }) {
  if (!filters || !onChange) {
    return <p className="muted">Sort and filter controls (not implemented yet)</p>;
  }

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="card-header">
        <h3>Sort and Filter</h3>
        <span className="badge">Optional</span>
        </div>

      <div className="filter-grid">
        <label>
          Status
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Sort
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          >
            <option value="dueAsc">Due date (soonest first)</option>
            <option value="dueDesc">Due date (latest first)</option>
            <option value="priority">Priority (high to low)</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={filters.priority}
            onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          >
            <option value="all">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label>
          Course tag contains
          <input
            value={filters.course}
            onChange={(e) => onChange({ ...filters, course: e.target.value })}
            placeholder="e.g., CIS 476"
          />
        </label>
      </div>
    </div>
  );
}