# How to Run the Application

## Prerequisites
1. Python 3.8+ installed
2. PostgreSQL installed and running
3. Node.js installed

## Setup Steps

### 1. Setup PostgreSQL Database
- Open PostgreSQL and create database:
  ```sql
  CREATE DATABASE booth_agent_db;
  ```
- Update credentials in `src/backend/.env` if needed

### 2. Install Backend Dependencies
```bash
cd src/backend
pip install -r requirements.txt
```

### 3. Initialize Admin User
```bash
cd src/backend
python -m app.init_admin
```
This creates admin user:
- Username: `admin`
- Password: `Admin@123`

### 4. Start Backend Server
Option A: Use the batch file
```bash
START_BACKEND.bat
```

Option B: Manual start
```bash
cd src/backend
python -m uvicorn app.main:app --reload --port 8000
```

### 5. Start Frontend (in new terminal)
```bash
npm run dev
```

## Login Credentials
- Username: `admin`
- Password: `Admin@123`

## Troubleshooting
- If backend fails, check PostgreSQL is running
- If login fails, ensure backend is running on port 8000
- Check browser console for API errors
