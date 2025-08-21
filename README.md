## Master Performance

Modern full‑stack platform for vehicle performance management, customer support chat, file uploads, analytics, and more. Built with Node.js/Express, MongoDB, Socket.IO, and React (MUI).

### Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Install](#install)
  - [Run in Development](#run-in-development)
  - [Build](#build)
- [Architecture](#architecture)
- [Key Endpoints](#key-endpoints)
- [Chat and File Uploads](#chat-and-file-uploads)
- [Troubleshooting](#troubleshooting)
- [License](#license)

### Features
- Admin–customer real‑time chat with read receipts (Socket.IO)
- Secure file uploads to Cloudinary directly from chat
- Auth (JWT) with protected routes and role‑based admin features
- Vehicle/tuning modules, projects and uploads
- Health check endpoint and clear server logging

### Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.IO, Cloudinary, Multer
- Frontend: React 18, React Router, Redux Toolkit, MUI, Axios, Socket.IO client
- Tooling: dotenv, nodemon, ESLint (via CRA defaults)

### Monorepo Structure
```
backend/    # Express API + Socket.IO + MongoDB
frontend/   # React app (CRA) with MUI and Socket.IO client
```

### Getting Started

#### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas (or a local MongoDB instance)
- Cloudinary account (for chat file uploads)

#### Environment Variables

Create `backend/.env` with:
```env
# Server
PORT=5001
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

# Auth
JWT_SECRET=super-strong-secret

# Cloudinary (required for chat file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Frontend uses a proxy to the backend (`http://localhost:5001`) via CRA configuration in `frontend/package.json`. No frontend env is required for basic dev.

#### Install
```bash
# From repo root
cd backend && npm install
cd ../frontend && npm install
```

#### Run in Development
Open two terminals:

```bash
# Terminal 1 – Backend
cd backend
npm run dev

# Terminal 2 – Frontend
cd frontend
npm run dev
```

Backend will start on `http://localhost:5001`, frontend on `http://localhost:3000`.

#### Build
```bash
# Frontend production build
cd frontend
npm run build
```

### Architecture
```mermaid
flowchart LR
  subgraph Client[Frontend - React]
    UI[UI (MUI, React, Redux)]
    SockClient[Socket.IO Client]
    Axios[Axios]
  end

  subgraph Server[Backend - Express]
    API[REST API]
    SockServer[Socket.IO Server]
    Upload[Cloudinary Upload Service]
    Auth[JWT Auth]
  end

  DB[(MongoDB)]
  Cloudinary[(Cloudinary Storage)]

  UI -->|HTTP| Axios --> API
  SockClient <-->|WebSocket| SockServer
  API --> DB
  API --> Upload --> Cloudinary
  SockServer --> DB
  Auth -. protects .-> API
```

### Key Endpoints
- Auth: `POST /api/auth/login`, `POST /api/auth/register`
- Vehicles: `GET /api/vehicles`, `POST /api/vehicles` (admin only where applicable)
- Tuning: `POST /api/tuning/upload-file`, `GET /api/tuning/projects/...`
- Chat:
  - Conversations (admin): `GET /api/chat/conversations`
  - Default admin: `GET /api/chat/default-admin`
  - Messages: `GET /api/chat/messages/:otherUserId`
  - Start conversation (admin): `POST /api/chat/start/:userId`
  - Upload file: `POST /api/chat/upload` (multipart/form-data, field: `file`)

### Chat and File Uploads
- Real‑time chat with per‑conversation read receipts:
  - Client emits `markAsRead` with `{ conversationId, userId }`
  - Server marks messages and broadcasts `messagesMarkedAsRead`
- File uploads in chat:
  - Client selects a file → `POST /api/chat/upload`
  - Server streams file to Cloudinary (resource_type=auto)
  - Client sends a chat message with `fileUrl`, `fileName`, `fileType`
  - UI shows progress, success/error toasts, and previews (images inline)

Request shape (client → server) after successful upload:
```json
{
  "senderId": "<user_id>",
  "recipientId": "<other_user_id>",
  "text": "",
  "fileUrl": "https://res.cloudinary.com/.../file",
  "fileName": "document.pdf",
  "fileType": "application/pdf"
}
```

### Troubleshooting
- 500 on `POST /api/chat/upload`:
  - Ensure Cloudinary creds are set in `backend/.env`
  - Restart backend after editing env
  - Check server logs (we log missing creds and upload flow)
- CORS issues:
  - Update `FRONTEND_URL` to match your dev domain/port
- MongoDB connection error:
  - Verify `MONGODB_URI` and network access in Atlas
- Socket not connecting:
  - Make sure backend runs on `PORT=5001` and frontend proxy points to it

### License
This project is licensed under the MIT License.

