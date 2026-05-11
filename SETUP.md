# Quick Start Guide for CSDS Project

## Prerequisites
- Node.js v14+ and npm
- MongoDB connection string (MongoDB Atlas or local)

## Installation Steps

### 1. Install Dependencies

```bash
# From project root
npm run install-all
```

OR install manually:

```bash
# Backend setup
cd server
npm install

# Frontend setup
cd client
npm install
```

### 2. Configure Environment Variables

**Server (.env)**
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**Client (.env)**
```bash
cd client
cp .env.example .env
# Default settings should work for local development
```

### 3. Start Development Servers

**Option A: Run both simultaneously (from root)**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:10000/api/v1

## Key Features

✅ User Registration & Login
✅ JWT Authentication
✅ Role-based Access Control (USER, ADMIN)
✅ Deadline Management
✅ Entry Submission System
✅ Admin Dashboard (view all submissions)

## Testing the API

Use tools like Postman or curl to test endpoints:

```bash
# Register
curl -X POST http://localhost:10000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456","role":"USER"}'

# Login
curl -X POST http://localhost:10000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
```

## Project Structure

```
.
├── server/              # Node.js + Express backend
│   ├── config/          # Database configuration
│   ├── Controllers/     # Request handlers
│   ├── Middleware/      # Auth & role middleware
│   ├── Models/          # Mongoose schemas
│   ├── Routers/         # API routes
│   ├── server.js        # Main entry point
│   └── package.json
│
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── assets/      # CSS, utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── README.md            # Full documentation
└── package.json         # Root scripts
```

## Troubleshooting

### MongoDB Connection Failed
- Check MONGO_URI in server/.env
- Verify IP is whitelisted in MongoDB Atlas
- Ensure connection string is correct

### Port 10000 Already in Use
- Change PORT in server/.env
- Or: `lsof -i :10000` and kill the process

### CORS Errors
- Verify frontend URL in server CORS config
- Check that server is running on correct port

### Dependencies Not Installing
- Delete node_modules and package-lock.json
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Build for Production

```bash
# Frontend
cd client
npm run build

# Output will be in client/dist/
```

## License

ISC

## Support

For issues, check the main README.md or create an issue.
