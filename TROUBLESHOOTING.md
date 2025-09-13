# 🔧 Troubleshooting Guide

## Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Windows
start.bat

# Mac/Linux
./start.sh
```

### Option 2: Manual Setup
```bash
# 1. Set up environment
node setup-env.js

# 2. Start server (Terminal 1)
cd server
npm start

# 3. Start frontend (Terminal 2)
npx serve . -p 8000
```

## 🚨 Common Issues & Solutions

### Issue 1: "GEMINI_API_KEY environment variable is required"
**Solution:**
1. Run `node setup-env.js` to create the .env file
2. Or manually create `server/.env` with:
   ```
   GEMINI_API_KEY=AIzaSyCw6qIY4Jgh6Z7AiVlgg2aavbSRDsya0w0
   NODE_ENV=development
   PORT=3000
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000
   ```

### Issue 2: CORS Errors in Browser
**Symptoms:** Console shows "Access to fetch at 'http://localhost:3000/api/...' from origin 'http://localhost:8000' has been blocked by CORS policy"

**Solution:**
1. Make sure both servers are running
2. Check that the frontend is served from `http://localhost:8000`
3. Verify the backend is running on `http://localhost:3000`

### Issue 3: AI Features Not Working
**Symptoms:** Chat assistant, business planner, or course outline generator not responding

**Solutions:**
1. **Check server logs** - Look for error messages in the terminal running the server
2. **Verify API key** - Make sure the Gemini API key is correct and has quota
3. **Check network** - Open browser dev tools and look for failed requests
4. **Test API directly** - Try accessing `http://localhost:3000/api/chat` with a tool like Postman

### Issue 4: "Failed to fetch" Errors
**Solutions:**
1. Make sure the server is running on port 3000
2. Check if port 3000 is available: `netstat -an | findstr :3000`
3. Try restarting the server
4. Check firewall settings

### Issue 5: Port Already in Use
**Solutions:**
1. **Find the process using the port:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```

2. **Kill the process:**
   ```bash
   # Windows
   taskkill /PID <process_id> /F
   
   # Mac/Linux
   kill -9 <process_id>
   ```

3. **Or use a different port:**
   - Change `PORT=3001` in `server/.env`
   - Update the API URLs in HTML files to use port 3001

## 🔍 Debugging Steps

### Step 1: Check Server Status
```bash
# Test if server is running
curl http://localhost:3000/api/chat
# Should return a CORS error (which is expected)
```

### Step 2: Check API Key
```bash
# In server directory
node -e "require('dotenv').config(); console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');"
```

### Step 3: Check Browser Console
1. Open browser dev tools (F12)
2. Go to Console tab
3. Look for error messages
4. Go to Network tab to see failed requests

### Step 4: Test Individual Components
1. **Chat Assistant**: Try typing a message and check console
2. **Business Planner**: Open planner.html and test
3. **Course Outline**: Click "Generate Outline" button

## 📊 Expected Behavior

### When Working Correctly:
1. **Server starts** with message: "Proxy server running at http://localhost:3000"
2. **Frontend loads** at http://localhost:8000
3. **Chat assistant** responds to messages
4. **Business planner** opens in popup and responds
5. **Course outline** generates content when clicked

### Server Logs Should Show:
```
Proxy server running at http://localhost:3000
Chat request received: { contents: [...], systemInstruction: {...} }
Chat response sent successfully
```

## 🆘 Still Having Issues?

### Check These Files:
1. `server/.env` - Should contain your API key
2. `server/package.json` - Should have correct dependencies
3. Browser console - Look for JavaScript errors
4. Server terminal - Look for error messages

### Reset Everything:
```bash
# Stop all processes
# Delete node_modules and reinstall
cd server
rm -rf node_modules package-lock.json
npm install

# Restart
npm start
```

### Contact Support:
- Email: hello@fusion4o.com
- WhatsApp: +92 307 005 7308

## 🔧 Advanced Configuration

### Custom Ports:
1. Edit `server/.env`:
   ```
   PORT=3001
   ALLOWED_ORIGINS=http://localhost:8000,http://localhost:3001
   ```

2. Update HTML files to use new port:
   ```javascript
   const apiUrl = 'http://localhost:3001/api/chat';
   ```

### Production Setup:
1. Use HTTPS in production
2. Set `NODE_ENV=production`
3. Use a proper domain instead of localhost
4. Set up proper SSL certificates
