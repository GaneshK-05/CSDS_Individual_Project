# CSDS - Deadline Submission System

A full-stack web application for managing submission deadlines built with Node.js/Express backend and React frontend.

## Project Structure

```
.
├── server/              # Backend (Node.js + Express)
│   ├── Controllers/     # Request handlers
│   ├── Database/        # MongoDB connection
│   ├── Middleware/      # Auth and role middleware
│   ├── Models/          # Mongoose schemas
│   ├── Routers/         # API routes
│   ├── server.js        # Main server file
│   ├── package.json
│   ├── .env             # Environment variables (do not commit)
│   └── .env.example     # Example environment variables
│
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── assets/      # Static files, CSS, JS utilities
│   │   ├── services/    # API services
│   │   ├── App.jsx      # Main component
│   │   ├── main.jsx     # Entry point
│   │   ├── index.css
│   │   └── App.css
│   ├── index.html       # HTML template
│   ├── vite.config.js   # Vite configuration
│   ├── package.json
│   └── .env.example
│
└── README.md            # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB connection string

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```
PORT=10000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

5. Start the server:
```bash
npm start
```

The server will run on `http://localhost:10000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Submissions
- `POST /api/v1/submission/` - Submit entry (requires auth)
- `GET /api/v1/submission/my` - Get user's submissions (requires auth)

### Admin
- `POST /api/v1/admin/deadline` - Set deadline (requires admin role)
- `GET /api/v1/admin/submissions` - Get all submissions (requires admin role)

## Environment Variables

### Server (.env)
```
PORT=10000                              # Server port
MONGO_URI=mongodb+srv://...             # MongoDB connection string
JWT_SECRET=your_secret_key              # JWT secret key
```

### Client (.env)
```
VITE_API_BASE_URL=http://localhost:10000/api/v1  # Backend API URL
```

## Features

- User authentication with JWT
- Role-based access control (USER, ADMIN)
- Deadline management
- Entry submission system
- MongoDB database integration
- React frontend with Vite
- RESTful API design

## Development

### Backend Development
- ESM module system
- Express.js for HTTP server
- Mongoose for MongoDB
- JWT for authentication
- bcryptjs for password hashing

### Frontend Development
- React 18 with hooks
- Vite for fast development
- Axios for HTTP requests
- CSS for styling

## Error Handling

The application includes comprehensive error handling:
- Input validation on all endpoints
- Try-catch blocks in all async functions
- Proper HTTP status codes
- Descriptive error messages

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based authorization middleware
- CORS enabled
- HTTP-only cookies support

## Production Build

### Backend
No build required - runs directly with Node.js

### Frontend
```bash
npm run build
```

This creates a `dist` folder with optimized production build.

## Troubleshooting

### MongoDB Connection Issues
- Verify MONGO_URI in .env
- Check MongoDB cluster firewall settings
- Ensure IP is whitelisted in MongoDB Atlas

### CORS Errors
- Check CORS configuration in server.js
- Verify frontend URL is in CORS whitelist

### Port Already in Use
- Change PORT in .env
- Or kill the process using the port

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
