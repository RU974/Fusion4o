const fs = require('fs');
const path = require('path');

// Create .env file in server directory
const envContent = `# Environment Variables for Fusion4o Server
GEMINI_API_KEY=AIzaSyCw6qIY4Jgh6Z7AiVlgg2aavbSRDsya0w0
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000
`;

const envPath = path.join(__dirname, 'server', '.env');

try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully in server directory');
    console.log('🚀 You can now start the server with: cd server && npm start');
} catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    console.log('📝 Please manually create server/.env with the following content:');
    console.log(envContent);
}
