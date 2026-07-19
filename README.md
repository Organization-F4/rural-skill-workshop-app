# 🌾 Rural Skill Workshop Locator & Registration Platform

A mobile-first platform that connects rural youth to skill-building workshops in their vicinity. Residents can browse and register for workshops (tailoring, carpentry, digital literacy), while organizers can post workshops, manage registrations, and track attendance.

## 📱 Features

- **Authentication & Roles** — Secure register/login with JWT. Two roles: participant and organizer.
- **Workshop Discovery** — Browse workshops with search by title, skill type, or location.
- **Workshop Registration** — Participants can register for workshops (with duplicate prevention).
- **Attendance Tracking** — Organizers mark attendance (present/absent) with live updates.
- **Organizer Dashboard** — View the list of registered users per workshop.
- **Notifications** — In-app notification center with mark-as-read.

## 🛠️ Tech Stack

**Frontend:** React Native (Expo)
**Backend:** Node.js, Express
**Database:** MongoDB (Atlas)
**Auth:** JWT, bcrypt

## 📂 Project Structure

rural-skill-workshop-app/
├── backend/
│   ├── config/        # Database connection
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth & role checks
│   ├── models/        # User, Workshop, Registration, Notification
│   ├── routes/        # API routes
│   └── server.js      # Entry point
└── frontend/
├── screens/       # Login, Registered Users, Notifications
├── config.js      # API URL
└── App.js         # Navigation

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:


MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001

Start the server:

```bash
node server.js
```

You should see: `Server running on port 5001` and `MongoDB Connected`.

### Frontend Setup

```bash
cd frontend
npm install
```

In `frontend/config.js`, set your computer's local IP:

```javascript
export const API_URL = 'http://YOUR_IP:5001/api';
```

Start the app:

```bash
npx expo start
```

Scan the QR code using the **Expo Go** app on your phone (phone and laptop must be on the same WiFi).

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a token
- `GET /api/auth/me` — Get current user (protected)

### Workshops
- `GET /api/workshops` — List workshops (supports `?search=`)
- `POST /api/workshops` — Create a workshop (organizer only)
- `GET /api/workshops/my` — Organizer's own workshops
- `POST /api/workshops/:id/register` — Register for a workshop

### Registrations & Attendance
- `GET /api/workshops/:id/registrations` — View registered users
- `PATCH /api/workshops/registrations/:regId/attendance` — Mark attendance

### Notifications
- `GET /api/notifications` — Get notifications
- `POST /api/notifications` — Create a notification
- `PATCH /api/notifications/:id/read` — Mark as read

## 👥 Team

- Kumari
- Shristy
- Nishant
- Akanksha

## 📄 License

This project was built as part of the STCIP React Native Mobile App Development program.

