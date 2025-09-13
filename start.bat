@echo off
echo 🚀 Starting Fusion4o Application...
echo.

echo 📁 Setting up environment...
node setup-env.js

echo.
echo 🔧 Starting server...
cd server
start "Fusion4o Server" cmd /k "npm start"

echo.
echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak > nul

echo.
echo 🌐 Starting frontend server...
cd ..
start "Fusion4o Frontend" cmd /k "npx serve . -p 8000"

echo.
echo ✅ Application started!
echo 📱 Frontend: http://localhost:8000
echo 🔧 Backend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
