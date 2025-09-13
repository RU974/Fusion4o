# Fusion4o - AI-Powered Marketing & Learning Platform

A modern web application featuring AI-powered business planning, course outline generation, and comprehensive marketing services.

## 🚀 Features

- **AI Business Planner**: Interactive chat-based business planning tool
- **Course Outline Generator**: AI-powered curriculum creation for educational content
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Chat**: AI assistant for customer support
- **Performance Optimized**: Hardware-accelerated animations and optimized loading

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Fusion4o
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp ../env.example .env
   
   # Edit .env and add your API key
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   NODE_ENV=development
   PORT=3000
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Serve the frontend**
   ```bash
   # From the root directory, serve the HTML files
   # You can use any static file server, for example:
   npx serve .
   # or
   python -m http.server 8000
   # or
   php -S localhost:8000
   ```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Your Gemini API key | Yes | - |
| `NODE_ENV` | Environment (development/production) | No | development |
| `PORT` | Server port | No | 3000 |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | No | localhost origins |

## 🔧 Security Features

- ✅ API key stored in environment variables
- ✅ Input sanitization to prevent XSS attacks
- ✅ CORS protection with configurable origins
- ✅ Error handling with user-friendly messages
- ✅ No hardcoded credentials

## 🎨 Performance Optimizations

- ✅ Hardware-accelerated CSS animations
- ✅ Resource preloading for critical assets
- ✅ Optimized image loading
- ✅ Efficient DOM manipulation
- ✅ Minimal external dependencies

## 📱 Accessibility Features

- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ Semantic HTML structure

## 🚨 Important Security Notes

1. **Never commit your `.env` file** - It contains sensitive API keys
2. **Use HTTPS in production** - All API calls should be encrypted
3. **Regularly rotate API keys** - For enhanced security
4. **Monitor API usage** - Set up billing alerts for your Gemini API

## 🐛 Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY environment variable is required"**
   - Make sure you've created a `.env` file in the `server` directory
   - Verify the API key is correctly set in the `.env` file

2. **CORS errors in browser**
   - Check that your frontend is being served from an allowed origin
   - Update `ALLOWED_ORIGINS` in your `.env` file if needed

3. **API calls failing**
   - Verify your Gemini API key is valid and has sufficient quota
   - Check the server logs for detailed error messages

### Development Tips

- Use browser developer tools to monitor network requests
- Check server console for error logs
- Test with different browsers to ensure compatibility

## 📁 Project Structure

```
Fusion4o/
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   ├── package.json       # Dependencies
│   └── .env              # Environment variables (create this)
├── css/
│   └── style.css         # Main stylesheet
├── js/
│   └── script.js         # Frontend JavaScript
├── Images/               # Static assets
├── index.html           # Main page
├── education.html       # Education page
├── planner.html         # Business planner
└── env.example         # Environment template
```

## 🔄 Recent Updates

- ✅ Fixed critical security vulnerabilities
- ✅ Implemented proper error handling
- ✅ Added input sanitization
- ✅ Optimized performance
- ✅ Improved accessibility
- ✅ Removed code duplication
- ✅ Made URLs environment-aware

## 📞 Support

For technical support or questions:
- Email: hello@fusion4o.com
- WhatsApp: +92 307 005 7308

## 📄 License

All rights reserved. © 2025 Fusion4o.
