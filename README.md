# Student Resource Booking System

## Project Overview
This is a full-stack web application that allows students to book various resources (like study rooms, equipment, etc.) in an educational institution for a Web Technology End of Semester Exam. The system includes user authentication, resource management, and booking functionality.

## Deployment Links
- **Backend (Render)**: [https://todo-backend-10s1.onrender.com]
-  **Frontend(Render)**: [https://todo-frontend-rqqw.onrender.com]

-  **Backend(GitHub Pages)**: [https://github.com/Kofi-Assan/TODO_BACKEND.git]
-  **Frontend (GitHub Pages)**: [https://github.com/Kofi-Assan/TODO_FRONTEND.git]

## Login Details
- **Admin Account**:
  - Email: admin@example.com
  - Password: admin123

## Project Overview
This is a full-stack web application that allows students to book various resources (like study rooms, equipment, etc.) in an educational institution for a Web Technology End of Semester Exam. The system includes user authentication, resource management, and booking functionality.

## Deployment Links
- **Backend (Render)**: [https://todo-backend-10s1.onrender.com]

-  **Frontend(Render)**: [https://todo-frontend-rqqw.onrender.com]

- **Backend(GitHub Pages)**: [https://github.com/Kofi-Assan/TODO_BACKEND.git]

- **Frontend (GitHub Pages)**: [https://github.com/Kofi-Assan/TODO_FRONTEND.git]

## Login Details(Examples)
- **Admin Account**:
  - Email: admin@example.com
  - Password: admin123
- **Student Account**:
  - Email: student@example.com
  - Password: student123

## Feature Checklist
- [x] User Registration & Authentication (15 Marks)  
- [x] Secure registration and login system
- [x] Role-based access: Regular users vs. Admins
- [x] Resource Listing & Availability (15 Marks)
- [x] Show available resources with status (Available, Booked)
- [x] Include descriptions, availability slots, and categories
- [x] Booking System (15 Marks)
- [x] Allow students to book available slots
- [x] Users can view, update, or cancel their bookings
- [x] Admins can add, update, or remove resources  
- [x] View all bookings and manage users

## Installation Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v16 preferably as Render doesn't support PostgreSQL v17)
- npm or yarn package manager

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Kofi-Assan/TODO_BACKEND.git
   cd TODO_BACKEND
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/student_resource_db
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will start on `http://localhost:5000`

### Frontend Setup
1. Clone the frontend repository:
   ```bash
   git clone https://github.com/Kofi-Assan/TODO_FRONTEND.git
   cd student-resource-booking-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend application will start on `http://localhost:3000`

## API Documentation
The backend API documentation is available at `/api-docs` when running the server locally.

## Contributing

## License
This project is licensed under the MIT License.
- **Student Account**:
  - Email: student@example.com
  - Password: student123

## Feature Checklist
- [x] User Registration & Authentication (15 Marks)  
- [x] Secure registration and login system
- [x] Role-based access: Regular users vs. Admins
- [x] Resource Listing & Availability (15 Marks)
- [x] Show available resources with status (Available, Booked)
- [x] Include descriptions, availability slots, and categories
- [x] Booking System (15 Marks)
- [x] Allow students to book available slots
- [x] Users can view, update, or cancel their bookings
- [x] Admins can add, update, or remove resources  
- [x] View all bookings and manage users

## Installation Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v16 preferably as Render doesn't support PostgreSQL v17)
- npm or yarn package manager

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Kofi-Assan/TODO_BACKEND.git
   cd TODO_BACKEND
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/student_resource_db
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will start on `http://localhost:5000`

### Frontend Setup
1. Clone the frontend repository:
   ```bash
   git clone https://github.com/Kofi-Assan/TODO_FRONTEND.git
   cd student-resource-booking-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend application will start on `http://localhost:3000`

## API Documentation
The backend API documentation is available at `/api-docs` when running the server locally.

## Contributing

## License
This project is licensed under the MIT License.
