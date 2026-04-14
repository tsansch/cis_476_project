from abc import ABC, abstractmethod
from typing import List
from .models import Task

class TaskSortStrategy(ABC):
    @abstractmethod
    def apply(self, tasks: List[Task]) -> List[Task]:
        pass


class SortByDueDate(TaskSortStrategy):
    def apply(self, tasks):
        return sorted(tasks, key=lambda t: (t.due_date is None, t.due_date))


class SortByPriority(TaskSortStrategy):
    PRIORITY_ORDER = {"High": 0, "Medium": 1, "Low": 2}
    def apply(self, tasks):
        return sorted(tasks, key=lambda t: self.PRIORITY_ORDER.get(t.priority, 99))


class GroupByCourse(TaskSortStrategy):
    def apply(self, tasks):
        return sorted(tasks, key=lambda t: (t.course_id is None, t.course_id or ""))