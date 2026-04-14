# Strategy Pattern

from abc import ABC, abstractmethod
from typing import List
from models import Task

# Abstract base class - defines the interface
class TaskSortStrategy(ABC):
    @abstractmethod
    def apply(self, tasks: List[Task]) -> List[Task]:
        pass

# Concrete Strategy 1: Sort by due date
class SortByDueDate(TaskSortStrategy):
    def apply(self, tasks):
        return sorted(tasks, key=lambda t: (t.due_date is None, t.due_date))

# Concrete Strategy 2: Sort by priority
class SortByPriority(TaskSortStrategy):
    PRIORITY_ORDER = {"High": 0, "Medium": 1, "Low": 2}
    def apply(self, tasks):
        return sorted(tasks, key=lambda t: self.PRIORITY_ORDER.get(t.priority, 99))


class GroupByCourse(TaskSortStrategy):
    def apply(self, tasks):
        return sorted(tasks, key=lambda t: (t.course_id is None, t.course_id or ""))
