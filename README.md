# Library Management System

A simple Library Management System built as a learning project to practice and implement the concepts learned during MERN stack training.

This project focuses on understanding how the frontend, backend, and database work together in a basic full-stack application.

## Tech Stack

- React
- JavaScript
- HTML
- CSS
- Node.js
- Express.js
- MongoDB

## Features

- Admin login
- Dashboard with basic library statistics
- Add, view, edit, and delete books
- Add, view, edit, and delete students
- Issue books to students
- Return issued books
- Search books and students

## Project Structure

```text
Library-Management-System/
│
├── frontend/       # React frontend
├── backend/        # Node.js and Express backend
```

## How It Works

The frontend is built using React and communicates with the backend through REST APIs.

The backend is built using Node.js and Express.js and handles the application logic and API requests.

MongoDB is used to store the application data, with Mongoose used to communicate with the database.

```text
React
  ↓
Express / Node.js
  ↓
Mongoose
  ↓
MongoDB
```

## Running the Project

### Backend

```bash
cd backend
npm install
npm start
```

Create a `.env` file inside the `backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Note

This is a **basic learning project** created to practice and implement the concepts learned during MERN stack training.

The project intentionally focuses on simple and practical functionality rather than advanced features or complex architecture.