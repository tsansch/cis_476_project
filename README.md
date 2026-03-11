## Taskboard Webapp
A personal task management web app designed to help users organize tasks, set priorities, track progress, and manage deadlines effectively.

## Problem
Keeping track of assignments, projects, and daily responsibilities can be challenging. Tasks can slip through the cracks and due dates can sneak up, especially when managing multiple classes and responsibilities.

## Solution
Our solution is a simple task management web app where users can create tasks, set priority and due dates, tag tasks by course, and track progress. The app also supports reminders and multiple ways to view tasks to help users stay on schedule.

## Main Use Cases / Requirements
- Creating Tasks: Users can add a new task with details such as title, description, priority, due date, and course tag.
- Editing Tasks: Users can modify task details including updating the description, priority, or due date.
- Deleting Tasks: Users can remove tasks that are no longer needed.
- Viewing Tasks: Users can see all tasks in multiple views like a weekly view, by course, or by priority.
- Setting Reminders/Notifications: Users receive alerts when tasks are approaching their due date.
- Tracking Progress: Users can mark tasks as completed and view overall progress on pending and completed tasks.
- Sorting and Filtering Tasks: Users can dynamically organize tasks by priority, due date, or course tag.
- Specialized or Recurring Tasks: Users can add tasks that repeat on a schedule or require special handling like urgent tasks.

## Tech Stack
- Frontend: React
- Backend: Python FastAPI
- Database: SQLite

## Architecture
- Client Server: The React frontend sends HTTP requests to the FastAPI backend, and the backend returns data for the UI to display.
- Layered backend: API routes call the service layer, which uses repositories to read and write data in SQLite.

## Design Patterns
- Factory Method: Handles creation logic for different task types, such as recurring vs standard, based on user input.
- Facade: Used as a service layer to provide a simplified interface for the API to call.
- Repository: Used to abstract database operations so the rest of the app is not tied to raw SQL.
- Strategy: Used to switch between different ways to organize tasks, such as sorting by due date or grouping by week or course.
- Observer: Used for reminders so the UI can react when tasks are approaching their due date and show an alert.

## Repo Structure
- frontend/ (React UI)
- backend/ (FastAPI server)

## Team
Group 4: Fatima Saad, Marcel Bashi, Marisa Sikes, Tristan Elizalde
