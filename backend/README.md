# StreamGuestPay Backend API

Backend API server for tracking registered experts and clients on the StreamGuestPay platform.

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

The server will start on `http://localhost:3001` (or the port specified in `.env`).

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Register User
```
POST /api/users/register
```
Register a new expert or client.

**Request Body:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "role": "expert",
  "fullName": "John Doe",
  "professionalTitle": "Senior Product Manager",
  "areaOfExpertise": "Web3, DeFi, Blockchain",
  "hourlyRate": "300"
}
```

**For Clients:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "role": "client",
  "fullName": "Jane Smith",
  "company": "Tech Corp"
}
```

### Get User by Address
```
GET /api/users/:address
```
Retrieve user information by wallet address.

**Example:**
```
GET /api/users/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### Get All Users
```
GET /api/users
```
Get all registered users. Optional query parameter:
- `role`: Filter by role (`expert` or `client`)

**Example:**
```
GET /api/users?role=expert
```

### Update User
```
PUT /api/users/:address
```
Update user information.

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "hourlyRate": "350"
}
```

### Delete User
```
DELETE /api/users/:address
```
Delete a user from the system.

## Database

Uses **SQLite** database (`data/users.db`) - a lightweight, file-based SQL database perfect for small to medium projects.

### Why SQLite?

- ✅ No separate server process needed
- ✅ File-based (easy to backup and migrate)
- ✅ Fast and reliable
- ✅ Full SQL support
- ✅ Perfect for development and small production deployments
- ✅ Can easily migrate to PostgreSQL/MySQL later if needed

### Database Schema

The `users` table includes:
- `address` (PRIMARY KEY) - Wallet address
- `role` - 'expert' or 'client'
- `fullName` - User's full name
- `professionalTitle` - Expert's professional title (nullable)
- `areaOfExpertise` - Expert's area of expertise (nullable)
- `hourlyRate` - Expert's hourly rate in USDC (nullable)
- `company` - Client's company name (nullable)
- `registeredAt` - Registration timestamp
- `updatedAt` - Last update timestamp

### Database Location

The database file is stored at: `backend/data/users.db`

**Note:** The `data/` directory is gitignored, so your database won't be committed to version control.

## Integration with Smart Contract

When a user registers:

1. **Frontend** calls the backend API to register the user
2. **Backend** saves user data
3. **Frontend** calls the smart contract to register the user on-chain
4. On subsequent visits, frontend checks backend first, then smart contract if needed

## Example Integration Flow

```javascript
// 1. Register user on backend
const response = await fetch('http://localhost:3001/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    address: userAddress,
    role: 'expert',
    fullName: 'John Doe',
    professionalTitle: 'Senior PM',
    areaOfExpertise: 'Web3, DeFi',
    hourlyRate: '300'
  })
});

// 2. Register on smart contract
await contract.registerExpert(userAddress);

// 3. On return visit, check backend first
const userResponse = await fetch(`http://localhost:3001/api/users/${userAddress}`);
if (userResponse.ok) {
  const { user } = await userResponse.json();
  // User exists, load dashboard
}
```

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

## Development

### Adding New Endpoints

1. Create route in `src/routes/`
2. Create controller in `src/controllers/`
3. Add validation in `src/middleware/`
4. Update storage functions if needed

### Upgrading to Database

Replace the functions in `src/storage/storage.js` with database queries. The API interface remains the same.

## License

MIT

