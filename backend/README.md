# KonsultPay Backend API

Backend API server for tracking registered experts and clients on the KonsultPay platform.

## Features

- User registration (experts and clients)
- User retrieval by wallet address
- User update and deletion
- JSON-based storage (easily upgradeable to database)
- RESTful API endpoints
- CORS enabled for frontend integration

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Database

Uses **SQLite** database (`data/users.db`) - a lightweight, file-based SQL database perfect for small to medium projects.

## Project Structure

```
backend/
├── src/
│   ├── index.js              # Main server file
│   ├── routes/
│   │   └── users.js          # User routes
│   ├── controllers/
│   │   └── userController.js # User business logic
│   ├── middleware/
│   │   └── validation.js     # Request validation
│   └── storage/
│       └── storage.js        # Data storage layer
├── data/
│   └── users.json            # User data (gitignored)
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── README.md
```
