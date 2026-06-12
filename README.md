# ApplyWise

> A full-stack Job Application Management Platform built with the MERN Stack.

ApplyWise helps job seekers organize applications, track interviews, manage resumes and cover letters, and visualize job search progress through an interactive dashboard.

---

## Features

### Authentication
- Secure JWT Authentication
- User Registration & Login
- Protected Routes
- Password Hashing with bcrypt

### Job Tracking
- Add, Edit, Delete Applications
- Track Application Status
  - Applied
  - Interview
  - Offer
  - Rejected
- Store Salary, Location, Notes & Job Links
- Interview Date, Round & Notes

### Analytics Dashboard
- Total Applications
- Interview Count
- Rejection Count
- Interactive Pie Chart Analytics
- Animated Statistics Cards

### Document Library
- Upload Resumes
- Upload Cover Letters
- PDF, DOC, DOCX Support
- Link Documents to Applications
- Manage Uploaded Files

### Productivity Features
- Search Applications
- Grid View
- Kanban Board View
- Drag & Drop Status Management
- Toast Notifications

### Modern UI
- Dark Mode / Light Mode
- Responsive Design
- Tailwind CSS
- Smooth Animations

---

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- dnd-kit
- react-hot-toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer

---

## Project Structure

```bash
applywise/
│
├── client/
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── ...
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/gargeekadam09/applywise.git
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm start
```



