import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import ProgressBar from "./ProgressBar";
import TaskCard from "./TaskCard";

// Tasks screen layout. We’ll wire up real data next.
export default function TaskList() {
  return (
    <div>
      <h3>Tasks</h3>
      <FilterBar />
      <TaskForm />
      <ProgressBar />
      <TaskCard />
    </div>
  );
}