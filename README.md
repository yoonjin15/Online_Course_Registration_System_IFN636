# Online Course Registration System

## Overview
This project is a full-stack web application that allows students to register for courses and manage their enrollments. The system also provides an admin interface to manage courses. It is built using the MERN stack (MongoDB, Express, React, Node.js) and follows standard software development practices including version control and CI/CD.

## Live Application
http://3.27.228.119

---
## Features

### User Features
- User registration and login (authentication with JWT)
- View available courses
- Register for a course
- Drop a course
- View enrolled courses
- Update user profile

### Admin Features
- Create new courses
- Update course details
- Delete courses
- Manage course capacity

---
## System Flow

### Student
- Login → View Courses → Course Detail → Register/Drop
- View enrolled courses in "My Courses"

### Admin
- Login → View Courses → Add/Edit/Delete Courses
- Manage course capacity and details

---
## Technology Stack
- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Authentication: JSON Web Token (JWT)
- Testing: Mocha, Chai, Sinon
- Version Control: GitHub
- Deployment: AWS EC2
- CI/CD: GitHub Actions

---
## Project Structure
```
project-root/
├── .github/workflows/
│ └── ci.yml
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── test/
│ ├── .env
│ ├── .env.example
│ ├── server.js
│ └── package.json
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ ├── App.js
│ │ ├── axiosConfig.jsx
│ │ ├── index.js
│ │ └── index.css
│ ├── tailwind.config.js
│ └── package.json
├── README.md
```

---
## Setup Instructions
To run this project locally, follow these steps:

### 1. Clone the repository
```
git clone https://github.com/yoonjin15/Online_Course_Registration_System_IFN636.git
cd Online_Course_Registration_System_IFN636
```

### 2. Install dependencies
```
npm run install-all
```

### 3. Environment Variables (Backend)
Create a `.env` file inside the backend folder:
```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret_key>
PORT=5001
```

### 4. Run the application
Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

---
## Access the application
- Local: http://localhost:3000  
- Deployed: http://3.27.228.119

---
## Test Credentials
You can use the following accounts to access the system:

### Student Account
Email: student_test@qut.edu.au  
Password: qwer1234  

### Admin Account
Email: admin_test@qut.edu.au  
Password: qwer1234     

---
## Running Tests
Run backend tests using:
```
cd backend
npm test
```

This will execute all unit tests for:
- Auth Controller
- Course Controller
- Enrollment Controller

---
## CI/CD
This project uses GitHub Actions for continuous integration and deployment.

The CI/CD pipeline performs:
- Dependency installation
- Backend testing
- Frontend build
- Deployment on AWS EC2 using PM2

Workflow file:
```
.github/workflows/ci.yml
```

---
## Notes
- Ensure MongoDB is properly connected (e.g., MongoDB Atlas)
- Environment variables must be correctly configured
- The system follows REST API design and MVC architecture

---
## Author
Yoonjin Ahn


---
## Starter Project
GitHub repository: https://github.com/nahaQUT/sampleapp_IFQ636.git
