# 🌾 Rural Skill Workshop Locator & Registration Platform

A full-stack mobile application that helps rural communities discover, register for, and manage skill development workshops. Built with React Native (both Expo and CLI), Node.js backend, and REST APIs.

---

## 📌 Project Overview

The Rural Skill Workshop platform connects workshop organizers with participants in rural areas. Organizers can create and manage workshops, while participants can browse, register, and receive notifications about upcoming skill development events.

### Key Features

- 🔐 Authentication & Role Management (Organizer / Participant)
- 🗺️ Workshop Discovery with Search & Filtering
- 📋 Workshop Registration & Attendance Tracking
- 🔔 Push Notifications for registered users
- 📊 Organizer Dashboard with attendance summary
- ✏️ Edit / Delete workshop management
- 📧 Email & SMS notification services

---

## 🗂️ Folder Structure

```
rural-skill-workshop-app/
├── backend/              # Node.js + Express REST API
├── frontend/             # Expo (React Native) Frontend
├── RuralSkillApp/        # React Native CLI Frontend
├── .gitignore
└── README.md
```

---

## 🔧 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB | Database |
| JWT | Authentication tokens |
| Nodemailer | Email notifications |

### Frontend (Expo)
| Technology | Purpose |
|---|---|
| React Native (Expo) | Cross-platform mobile app |
| Expo Router | Navigation |
| AsyncStorage | Local data persistence |
| Axios | API communication |

### Frontend (React Native CLI)
| Technology | Purpose |
|---|---|
| React Native CLI | Native mobile app |
| React Navigation | Stack & tab navigation |
| AsyncStorage | Local data persistence |
| Axios | API communication |

---

## 📁 Detailed Folder Breakdown

### `/backend`
REST API server handling all business logic.

```
backend/
├── controllers/      # Route logic (auth, workshop, users)
├── models/           # MongoDB schemas
├── routes/           # API endpoints
├── middleware/        # JWT auth middleware
├── utils/            # Email & SMS helpers
└── server.js         # Entry point
```

**API Endpoints:**
- `POST /api/auth/login` — User login
- `POST /api/auth/register` — User registration
- `GET /api/workshops` — Get all workshops
- `POST /api/workshops` — Create workshop (Organizer only)
- `PUT /api/workshops/:id` — Edit workshop
- `DELETE /api/workshops/:id` — Delete workshop
- `POST /api/workshops/:id/register` — Register for workshop
- `GET /api/workshops/:id/registered-users` — Get registered users

---

### `/frontend` (Expo)
Original frontend built with Expo framework.

```
frontend/
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── WorkshopListScreen.js
│   ├── WorkshopDetailsScreen.js
│   ├── CreateWorkshopScreen.js
│   ├── EditWorkshopScreen.js
│   ├── OrganizerDashboard.js
│   ├── RegisteredUsersScreen.js
│   └── NotificationScreen.js
├── context/
│   └── AuthContext.js        # Auth state management
├── navigation/
│   └── AppNavigator.js       # App routing
└── config.js                 # API URL config
```

---

### `/RuralSkillApp` (React Native CLI)
Rebuilt frontend using React Native CLI for better native performance.

```
RuralSkillApp/
├── android/              # Android native code
├── ios/                  # iOS native code
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── WorkshopListScreen.js
│   ├── WorkshopDetailsScreen.js
│   ├── CreateWorkshopScreen.js
│   ├── EditWorkshopScreen.js
│   ├── OrganizerDashboard.js
│   ├── RegisteredUsersScreen.js
│   └── NotificationScreen.js
├── components/
│   └── AppHeader.js
├── context/
│   └── AuthContext.js
├── navigation/
│   └── AppNavigator.js
├── config.js
├── App.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn
- MongoDB (local or Atlas)
- Android Studio / Xcode (for React Native CLI)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Organization-F4/rural-skill-workshop-app.git
cd rural-skill-workshop-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:
```bash
npm start
```

---

### 3. Frontend Setup (Expo)

```bash
cd frontend
npm install
npx expo start
```

---

### 4. Frontend Setup (React Native CLI)

```bash
cd RuralSkillApp
npm install
```

Update `config.js` with your backend URL:
```js
export const API_URL = 'http://YOUR_IP:5000/api';
```

Run on Android:
```bash
npx react-native run-android
```

Run on iOS:
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## 👥 Team & Branches

| Branch | Developer |
|---|---|
| `Nishant-workshop` | Nishant Singh |
| `Akanksha-workshop` | Akanksha |
| `Anjali-Workshop` | Anjali |
| `shristy-workshop` | Shristy |
| `dev` | Integration branch |
| `main` | Production branch |

---

## 🔄 Git Workflow

```
feature branch (Nishant-workshop)
        ↓
      dev branch
        ↓
     main branch
```

1. Work on your own branch
2. Merge to `dev` for integration testing
3. `main` is the final production branch

---

## 📄 License

This project is developed as part of a workshop training program.

---

> Built with ❤️ by Team F4
