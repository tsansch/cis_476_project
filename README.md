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

## Setup Instructions

### Prerequisites
- Python 3
- Node.js and npm

### Install Dependencies
From the project root run:

```bash
./setup.sh
```
This script will:
- create the backend virtual environment
- install backend dependencies from requirements.txt
- install frontend dependencies with npm

## Running the Application

### Start the Backend
Open a terminal and run:
```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Start the Frontend
Open a second terminal and run:
``` bash
cd frontend
npm run dev
```

Then open the app in your browser at:

http://localhost:5173

### If fails then you need to check to make sure your dependencies are installed

### Backend (python)
Open Terminal #1.
Navigate to the backend folder: cd backend
Create a Virtual Environment: python -m venv .venv
Activate the Environment: Mac/Linux: source .venv/bin/activate Windows: .venv\Scripts\activate
Install the Python tools: pip install -r requirements.txt
Start the Backend: uvicorn main:app --reload --port 8000
(Keep this terminal open!)

### Frontend (javascript/react)
Open Terminal #2.
Navigate to the frontend folder:cd frontend
Install the UI tools (npm): npm install
Start the Frontend: npm run dev

## Team
Group 4: 
- Fatima Saad
- Marcel Bashi
- Marisa Sikes
- Tristan Elizalde
