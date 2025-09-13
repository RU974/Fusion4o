// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Create a write stream for logging
const logStream = fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' });

// Custom error logging middleware
const logErrors = (err, req, res, next) => {
    const now = new Date();
    const errorMessage = `[${now.toISOString()}] ${err.stack}\n`;
    
    // Log to console and file
    console.error(err.stack);
    logStream.write(errorMessage);
    
    next(err);
};

// Environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

// Validate API key
if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is required');
    process.exit(1);
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
            process.env.ALLOWED_ORIGINS.split(',') : 
            ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8000', 'http://127.0.0.1:8000'];
            
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Set security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Middleware to verify requests
const verifyOrigin = (req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
        process.env.ALLOWED_ORIGINS.split(',') : 
        ['http://localhost:3000', 'http://127.0.0.1:3000'];
    
    // Allow if origin is missing (some clients/tools) or is in allowed origins
    if (!origin || allowedOrigins.includes(origin) || 
        origin.startsWith('http://localhost') || 
        origin.startsWith('http://127.0.0.1') || 
        /^(https?:)\/\/(192|10|172)\./.test(origin)) {
        return next();
    }
    // Otherwise reject unknown origins
    res.status(403).json({ error: 'Unauthorized origin' });
};

// Generic Gemini API handler
async function callGeminiAPI(payload) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

// Main chat endpoint
app.post('/api/chat', verifyOrigin, async (req, res) => {
    try {
        console.log('Chat request received:', req.body);
        const { contents, systemInstruction } = req.body;
        const result = await callGeminiAPI({ contents, systemInstruction });
        console.log('Chat response sent successfully');
        res.json(result);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

// Business planner endpoint
app.post('/api/planner', verifyOrigin, async (req, res) => {
    try {
        console.log('Planner request received:', req.body);
        const { contents, systemInstruction } = req.body;
        const result = await callGeminiAPI({ contents, systemInstruction });
        console.log('Planner response sent successfully');
        res.json(result);
    } catch (error) {
        console.error('Planner error:', error);
        res.status(500).json({ error: 'Failed to process planner request' });
    }
});

// Course outline generator endpoint
app.post('/api/course-outline', verifyOrigin, async (req, res) => {
    try {
        console.log('Course outline request received:', req.body);
        const { contents, systemInstruction } = req.body;
        const result = await callGeminiAPI({ contents, systemInstruction });
        console.log('Course outline response sent successfully');
        res.json(result);
    } catch (error) {
        console.error('Course outline error:', error);
        res.status(500).json({ error: 'Failed to process course outline request' });
    }
});

// Add the error logging middleware last
app.use(logErrors);

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});