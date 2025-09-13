#!/bin/bash

echo "🚀 Starting Fusion4o Application..."
echo

echo "📁 Setting up environment..."
node setup-env.js

echo
echo "🔧 Starting server..."
cd server
npm start &
SERVER_PID=$!

echo
echo "⏳ Waiting for server to start..."
sleep 3

echo
echo "🌐 Starting frontend server..."
cd ..
npx serve . -p 8000 &
FRONTEND_PID=$!

echo
echo "✅ Application started!"
echo "📱 Frontend: http://localhost:8000"
echo "🔧 Backend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop all services..."

# Function to cleanup on exit
cleanup() {
    echo
    echo "🛑 Stopping services..."
    kill $SERVER_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait
