# 🤖 AI Interview Platform

An AI-powered interview preparation platform that helps students and job seekers practice technical interviews, solve coding problems, analyze resumes, and receive AI-powered feedback.

## 🚀 Features

* 🔐 **User Authentication**

  * User signup and login
  * JWT-based authentication
  * Protected routes
  * Logout functionality

* 🎤 **AI Mock Interviews**

  * Select job role
  * Select experience level
  * Practice technical interview questions
  * Submit answers for evaluation

* 🧠 **AI Answer Evaluation**

  * Answer scoring out of 100
  * Detailed AI feedback
  * Strengths identification
  * Areas for improvement

* 💻 **Coding Practice**

  * Multiple coding problems
  * Test solutions against test cases
  * Automatic result evaluation
  * Coding performance feedback

* 📄 **Resume Analysis**

  * Upload PDF resume
  * Extract resume text
  * Identify technical skills
  * Find missing skills
  * Resume score
  * Improvement suggestions

* 📊 **Dashboard**

  * Interview statistics
  * Coding practice overview
  * Resume score
  * Progress tracking
  * Quick access to platform features

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt.js
* Multer

### AI & APIs

* OpenAI API
* Judge0 Code Execution API

### Other Tools

* Git
* GitHub
* PDF parsing

## 📁 Project Structure

```text
ai-interview-platform/
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── Server.js
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── component/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Interview.jsx
│   │   ├── Questions.jsx
│   │   ├── Results.jsx
│   │   ├── Resume.jsx
│   │   └── CodingPractice.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone git@github.com:shalinisingh62020-lang/ai-interview-platform.git
cd ai-interview-platform
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5
```

**Never commit your `.env` file or API keys to GitHub.**

### 5. Start the backend

From the `server` folder:

```bash
node Server.js
```

The backend will run on:

```text
http://localhost:5000
```

### 6. Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

The frontend will run on the Vite development server.

## 🔄 Application Flow

```text
User
  ↓
Signup / Login
  ↓
Dashboard
  ↓
┌───────────────────────┐
│                       │
│ AI Mock Interview     │
│ Coding Practice       │
│ Resume Analysis       │
│                       │
└───────────────────────┘
  ↓
Performance / Feedback
```

## 🔒 Security

The application includes:

* JWT authentication
* Password hashing using bcrypt
* Protected frontend routes
* Environment variables for API credentials
* Input validation
* Code execution limits

## 🎯 Future Improvements

* Real-time AI voice interviews
* Interview history stored per user
* Advanced performance analytics
* More programming languages
* Resume recommendations
* Job-specific interview preparation
* Deployment with production database
* Improved AI-generated interview questions

## 👩‍💻 Author

**Shalini Singh**

B.Tech Computer Science Student

### Project

**AI Interview Platform**

Built as a full-stack AI-powered interview preparation project.
