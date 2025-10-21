# 💬 Advanced Real-Time Chat Application

A modern and secure real-time web-based chat application built with Node.js, React, Socket.io, and MongoDB.

## 🚀 Features

### User Management
- ✅ User registration and secure login system
- ✅ JWT (JSON Web Token) based authentication
- ✅ Secure password hashing with bcrypt
- ✅ Automatic session management

### Chat Features
- ✅ Real-time messaging (Socket.io)
- ✅ Message history storage (MongoDB)
- ✅ Online users list
- ✅ Typing indicator ("User is typing...")
- ✅ Message timestamps
- ✅ User-friendly modern interface (Material-UI)

### Security
- ✅ JWT protected API endpoints
- ✅ Socket.io connection authentication
- ✅ Sensitive data stored in environment variables
- ✅ CORS configuration

## 📋 Requirements

- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the Project

```bash
git clone https://github.com/ensaryesir/node-chat-app.git
cd node-chat-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Backend Environment Variables

Create a `.env` file in the backend folder and add the following variables:

```env
# Server Configuration
PORT=5000

# MongoDB Database Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/chat-app

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app

# JWT Secret Key (use a strong key!)
# To generate a random key:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Note:** You can use the `.env.example` file as a reference.

### 4. MongoDB Setup

#### Local MongoDB:
- Download and install MongoDB from [here](https://www.mongodb.com/try/download/community)
- Start the MongoDB service

#### MongoDB Atlas (Cloud):
1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a free cluster
3. Create a database user
4. Add your IP to the whitelist
5. Copy the connection string and paste it into the `MONGODB_URI` in your `.env` file

### 5. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🚦 Running the Application

### Start Backend

Terminal 1:
```bash
cd backend
npm run dev
```

Backend will run at: `http://localhost:5000`

### Start Frontend

Terminal 2:
```bash
cd frontend
npm start
```

Frontend will run at: `http://localhost:3000`

## 📁 Project Structure

```
node-chat-app/
│
├── backend/                    # Backend (Node.js + Express)
│   ├── config/
│   │   └── database.js        # MongoDB connection configuration
│   ├── models/
│   │   ├── User.js            # User data model
│   │   └── Message.js         # Message data model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── messages.js        # Message routes
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── server.js              # Main server file
│   ├── package.json
│   ├── .env                   # Environment variables (in gitignore)
│   └── .env.example           # Environment variables example
│
└── frontend/                   # Frontend (React)
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.js  # Protected route component
    │   ├── context/
    │   │   └── AuthContext.js     # Authentication context
    │   ├── pages/
    │   │   ├── Login.js           # Login page
    │   │   ├── Register.js        # Registration page
    │   │   └── Chat.js            # Main chat page
    │   ├── services/
    │   │   └── api.js             # API service functions
    │   ├── App.js                 # Main application component
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🔧 Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables management
- **cors** - Cross-Origin Resource Sharing

### Frontend
- **React** - UI library
- **React Router** - Page routing
- **Material-UI (MUI)** - UI component library
- **Socket.io-client** - Socket.io client
- **Axios** - HTTP requests

## 📖 Usage

### 1. Registration
- Open the application (`http://localhost:3000`)
- Click on "Sign Up" link
- Enter your username, email, and password
- Click "Sign Up" button

### 2. Login
- Enter your email and password
- Click "Sign In" button
- After successful login, you'll be redirected to the chat page

### 3. Messaging
- Type your message in the chat interface and click "Send"
- Your messages will be delivered to other users in real-time
- Message history is automatically loaded

### 4. Online Users
- Click the menu icon in the top-left corner to see online users

### 5. Logout
- Click the logout icon in the top-right corner

## 🔒 Security Features

- Passwords are hashed with bcrypt (never stored as plain text)
- JWT tokens are valid for 7 days
- All protected API endpoints are secured with JWT middleware
- Socket.io connections are authenticated with tokens
- Sensitive information is protected with environment variables

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB service is running
- Check that the `MONGODB_URI` value in `.env` file is correct
- If using MongoDB Atlas, ensure your IP whitelist is up to date

### CORS Error
- Make sure backend and frontend are running on correct ports
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

### Socket.io Connection Error
- Ensure token is stored in localStorage
- Check error logs in browser console
- Make sure backend server is running

## 📝 Development Notes

### Backend Development
```bash
cd backend
npm run dev  # Auto-restart with nodemon
```

### Frontend Development
```bash
cd frontend
npm start  # Development with hot reload
```