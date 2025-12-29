Mini User Management System

A full-stack Mini User Management System implementing secure authentication, role-based access control (RBAC), and user lifecycle management.
Built as part of the Backend Developer Intern Assessment — December 2025.

🛠 Tech Stack

Backend: Node.js, Express, MongoDB (Mongoose)

Frontend: React 18, React Router, Axios

Authentication: JWT, bcrypt

Testing: Jest, Supertest, MongoDB Memory Server

Deployment: Render (Backend), Vercel / Netlify (Frontend), MongoDB Atlas

📦 Project Structure:
├── backend/
│   ├── src/
│   │   ├── app.js            # Express app configuration
│   │   ├── routes/           # Auth, User, Admin APIs
│   │   ├── models/           # User schema
│   │   ├── middleware/       # Auth & role-based guards
│   │   └── utils/            # Validators
│   ├── test/                 # Jest unit tests (7 tests)
│   ├── server.js             # Backend entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Login, Signup, Profile, AdminDashboard
│   │   ├── components/       # NavBar, ProtectedRoute, AuthRedirect
│   │   ├── services/         # Axios API service
│   │   ├── App.jsx           # Routing & auth flow
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── README.md

🚀 Local Setup & Run
Backend:
cd backend
npm install

# Create .env file
cp .env.example .env

npm start
# Runs on http://localhost:5000

Frontend
cd frontend
npm install

# Create .env file
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api

npm start
# Runs on http://localhost:3000
✅ Features Implemented
Authentication

User signup with full name, email, and password

Email format & password strength validation

User login with JWT-based authentication

Stateless logout (client-side token removal)

Protected routes for authenticated users

User Management

View own profile

Update full name and email

Change password (current password verification)

Admin Management

View all users with pagination

Activate user accounts

Deactivate user accounts

Frontend Pages

Login Page – Auth with validation & role-based redirect

Signup Page – Client + server validation

Profile Page – Edit profile & change password

Admin Dashboard – Paginated user table with actions

Navigation Bar – Role-aware navigation & logout

Security

Password hashing with bcrypt

JWT-based authentication

Role-based access control (admin/user)

Input validation on all endpoints

Environment-based configuration (.env excluded from repo)

Secure CORS configuration

📝 API Endpoints
Method	Endpoint	Auth	Admin	Description
POST	/api/auth/signup	✗	✗	User signup
POST	/api/auth/login	✗	✗	Login, returns JWT
POST	/api/auth/logout	✓	✗	Client-side logout
GET	/api/users/me	✓	✗	Get current user
PUT	/api/users/me	✓	✗	Update profile
POST	/api/users/change-password	✓	✗	Change password
GET	/api/admin/users	✓	✓	List users (paginated)
PUT	/api/admin/users/:id/activate	✓	✓	Activate user
PUT	/api/admin/users/:id/deactivate	✓	✓	Deactivate user
🧪 Testing

Run backend unit tests:

cd backend
npm test


Expected output:

Test Suites: 3 passed
Tests: 7 passed

🌐 Environment Variables
Backend (.env)
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key
PORT=5000

Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api

📦 Deployment
Backend (Render / Railway)

Push code to GitHub

Create backend service

Set environment variables

Deploy

Frontend (Vercel / Netlify)

Connect GitHub repo

Set REACT_APP_API_URL

Deploy

Database (MongoDB Atlas)

Create cluster

Whitelist IP

Create DB user

Use connection string in backend .env

📋 Submission Checklist

Backend tests pass

Frontend & backend run locally

GitHub repo is public

Backend deployed

Frontend deployed

MongoDB Atlas configured

.env files excluded

README accurate & complete

🎯 Demo Credentials

Create via signup:

Email: demo@example.com

Password: StrongPass123

Role: user

Admin access:

Create admin manually in DB (role = admin)


