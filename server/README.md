# Fusion4o Backend Server

This Node.js Express server acts as a secure proxy for the Gemini API, protecting your API key and managing requests from the frontend.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name/server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a file named `.env` in the `server` directory.

4.  **Add your API Key:**
    Open the `.env` file and add your Google Gemini API key:
    ```
    GEMINI_API_KEY=AIzaSy...your...key...here
    ```

5.  **Configure Allowed Origins (Optional):**
    By default, the server allows requests from `localhost:3000` and `localhost:8000`. If you are serving your frontend from a different address, add it to the `.env` file:
    ```
    ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:5500
    ```

## Running the Server

To start the server, run the following command in the `server` directory:

```bash
npm start
```

The server will start on `http://localhost:3000` by default.
