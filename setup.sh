#!/bin/bash

echo "Setting up backend..."
cd backend || exit
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

echo "Setting up frontend..."
cd ../frontend || exit
npm install

echo "Setup complete."
echo "Run backend with: cd backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000"
echo "Run frontend with: cd frontend && npm run dev"