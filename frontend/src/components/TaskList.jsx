import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import ProgressBar from "./ProgressBar";
import TaskCard from "./TaskCard";

// Tasks screen layout
export default function TaskList() {
  return (
    <div>
      <h3>Tasks</h3>

      <FilterBar />

      <div style={{ marginTop: 12, marginBottom: 16 }}>
        <TaskForm />
      </div>

      <ProgressBar />

      <div style={{ marginTop: 12 }}>
        <TaskCard />
      </div>
    </div>
  );
}