# Quick Start Guide for CSDS Project

## Prerequisites
- Node.js v14+ and npm
- MongoDB connection string (MongoDB Atlas or local)
- Multer (for file uploads) - auto-installed via npm
- Chart.js & react-chartjs-2 (for analytics) - auto-installed via npm
- react-hot-toast (for notifications) - auto-installed via npm

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

✅ **User Registration & Login** - Secure JWT-based authentication with role assignment
✅ **Role-based Access Control** - Separate interfaces for ADMIN and USER roles
✅ **Multi-Task Management** - Create and manage multiple assignments with flexible deadlines
✅ **File Upload System** - Upload files with type and size validation (supports PDF, DOC, DOCX, XLSX, ZIP, PNG, JPG, JPEG)
✅ **Text & File Submissions** - Flexible submission types with both text and file support
✅ **Real-time Countdown Timers** - Live deadline countdowns on task cards
✅ **Submission Status Tracking** - Automatic detection of On Time/Late/Missing submissions
✅ **Admin Analytics Dashboard** - Comprehensive analytics with submission status pie charts
✅ **Task Filtering** - User dashboard with filters for All Tasks, Upcoming, Submitted, and Expired
✅ **Modern UI/UX** - Glassmorphism design with dark theme and smooth animations
✅ **Toast Notifications** - Real-time feedback for all user actions

## Testing the API

### Authentication Endpoints
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

### Task Management Endpoints (ADMIN only)
```bash
# Create Task
curl -X POST http://localhost:10000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Assignment 1",
    "subject":"CS101",
    "description":"Submit your code",
    "deadline":"2024-12-25T23:59:59",
    "allowedFileTypes":["PDF","DOCX"],
    "maxFileSize":50,
    "submissionType":"File"
  }'

# Get All Tasks
curl -X GET http://localhost:10000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Task Statistics
curl -X GET http://localhost:10000/api/v1/tasks/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Submission Endpoints (ALL users)
```bash
# Submit Task (with file)
curl -X POST http://localhost:10000/api/v1/submission/TASK_ID/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf"

# Get My Submissions
curl -X GET http://localhost:10000/api/v1/submission/my \
  -H "Authorization: Bearer YOUR_TOKEN"

# Download Submission File
curl -X GET http://localhost:10000/api/v1/submission/download/SUBMISSION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Admin Analytics Endpoints
```bash
# Get Analytics Dashboard Data
curl -X GET http://localhost:10000/api/v1/admin/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
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
