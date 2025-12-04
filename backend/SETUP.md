# Quick Setup Guide

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work for local development).

## 3. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 4. Test the Database

Run the test script to verify everything works:

```bash
node src/scripts/test-db.js
```

## 5. Test API Endpoints

### Register an Expert
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "role": "expert",
    "fullName": "John Doe",
    "professionalTitle": "Senior Product Manager",
    "areaOfExpertise": "Web3, DeFi, Blockchain",
    "hourlyRate": "300"
  }'
```

### Register a Client
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x8f9e5d2c1a4b3e7f6c8d9e0f1a2b3c4d5e6f7a8b9",
    "role": "client",
    "fullName": "Jane Smith",
    "company": "Tech Corp"
  }'
```

### Get User by Address
```bash
curl http://localhost:3001/api/users/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### Get All Experts
```bash
curl http://localhost:3001/api/users?role=expert
```

### Get All Clients
```bash
curl http://localhost:3001/api/users?role=client
```

## Database Location

The SQLite database is stored at: `backend/data/users.db`

You can inspect it using:
- SQLite CLI: `sqlite3 data/users.db`
- DB Browser for SQLite (GUI tool)
- VS Code SQLite extension

## Troubleshooting

### Database locked error
- Make sure only one instance of the server is running
- Close any database viewers/editors

### Port already in use
- Change `PORT` in `.env` file
- Or kill the process using port 3001

### Module not found errors
- Run `npm install` again
- Make sure you're in the `backend` directory

