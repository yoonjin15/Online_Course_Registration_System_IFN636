# Online Course Registration System

## Overview
This project is a full-stack web application that allows students to register for courses and manage their enrollments. The system also provides an admin interface to manage courses. It is built using the MERN stack (MongoDB, Express, React, Node.js) and follows standard software development practices including version control and CI/CD.

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
project-root/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── test/
│ └── server.js
├── frontend/
│ ├── src/
│ └── public/
├── .github/workflows/
├── README.md


---

## Setup Instructions

### 1. Clone the repository
git clone <your-repository-url>
cd <your-project-folder>

### 2. Install dependencies
npm run install-all


### 3. Environment Variables (Backend)
Create a `.env` file in the backend folder and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001

### 4. Run the application
Development mode:
npm run dev

Production mode:
npm start

---

## Running Tests
Run backend tests using:
cd backend
npm test

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
.github/workflows/ci.yml


---

## Test Credentials

You can use the following accounts to access the system:

### Student Account
Email: test@student.com  
Password: 123456  

### Admin Account
Email: admin@test.com  
Password: 123456  

---

## Notes

- Ensure MongoDB is running or properly connected via cloud (e.g. MongoDB Atlas)
- Ensure environment variables are correctly configured
- The system follows REST API design and MVC architecture

---

## Author

Yoonjin Ahn


---
## Starter Project
**GitHub link of the starter project: **[https://github.com/nahaQUT/sampleapp_IFQ636.git](https://github.com/nahaQUT/sampleapp_IFQ636.git)