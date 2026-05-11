#!/bin/bash

echo "🔍 CSDS Platform - Dependency & Setup Verification"
echo "=================================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "  ✗ Node.js not found. Please install Node.js v14+"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo "  ✓ Node.js $NODE_VERSION found"
fi

echo ""
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "  ✗ npm not found"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo "  ✓ npm $NPM_VERSION found"
fi

echo ""
echo "✓ Checking project structure..."
if [ ! -f "package.json" ]; then
    echo "  ✗ Root package.json not found"
    exit 1
fi
echo "  ✓ Root package.json found"

if [ ! -d "server" ] || [ ! -f "server/package.json" ]; then
    echo "  ✗ Server directory or package.json not found"
    exit 1
fi
echo "  ✓ Server directory structure OK"

if [ ! -d "client" ] || [ ! -f "client/package.json" ]; then
    echo "  ✗ Client directory or package.json not found"
    exit 1
fi
echo "  ✓ Client directory structure OK"

echo ""
echo "✓ Checking .env files..."
if [ ! -f "server/.env" ]; then
    echo "  ⚠ server/.env not found (required for MongoDB connection)"
    echo "    Please create server/.env with:"
    echo "    PORT=10000"
    echo "    MONGO_URI=your_mongodb_connection_string"
    echo "    JWT_SECRET=your_jwt_secret"
else
    echo "  ✓ server/.env found"
fi

if [ ! -f "client/.env" ]; then
    echo "  ⚠ client/.env not found (will use defaults)"
else
    echo "  ✓ client/.env found"
fi

echo ""
echo "✓ Installation Instructions:"
echo "  1. Install backend dependencies:  cd server && npm install"
echo "  2. Install frontend dependencies: cd client && npm install"
echo "  3. Start backend:                 cd server && npm start"
echo "  4. Start frontend (new terminal): cd client && npm run dev"
echo "  5. Open browser:                  http://localhost:5173"
echo ""
echo "=================================================="
echo "✓ Setup verification complete!"
