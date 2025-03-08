# UniSphere

<div align="center">
  <h3>A Modern Social Platform for University Students</h3>
</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Detailed Feature Documentation](#detailed-feature-documentation)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)
- [Security Measures](#security-measures)
- [Monitoring](#monitoring)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

UniSphere is a social networking platform designed specifically for university students, enabling them to connect, collaborate, and share resources within their academic community.

## ✨ Features

- **User Authentication**

  - Secure email & password authentication
  - OAuth integration (Google, GitHub)
  - JWT-based session management

- **Profile Management**

  - Customizable user profiles
  - Academic information integration
  - Skills and interests showcase

- **Social Networking**

  - Connect with fellow students
  - Join university-specific groups
  - Real-time messaging system

- **Content Sharing**
  - Post updates and announcements
  - Share academic resources
  - Create and join events

## 🛠 Tech Stack

- **Frontend**

  - React.js
  - Redux for state management
  - Material-UI components
  - Socket.io client

- **Backend**
  - Node.js & Express
  - MongoDB database
  - JWT authentication
  - Socket.io for real-time features

## 🏗 System Architecture

### Frontend Architecture

- **Component Structure**
  - Atomic Design Pattern
  - Reusable UI Components
  - Custom Hooks for Business Logic
  - Redux Store Structure
    - Auth State
    - User State
    - Posts State
    - Messages State

### Backend Architecture

- **RESTful API Design**
  - Resource-based Routes
  - JWT Authentication Middleware
  - Rate Limiting
  - Request Validation
- **Database Schema**
  - Users Collection
  - Posts Collection
  - Messages Collection
  - Groups Collection
- **WebSocket Integration**
  - Real-time Message Handling
  - Live Notifications
  - Online Status Management

## 🔧 Detailed Feature Documentation

### Authentication System

- **JWT-based Authentication**
  - Access Token (24h expiry)
  - Refresh Token (7 days expiry)
  - Secure HTTP-only Cookies
- **OAuth Providers**
  - Google Sign-in
  - GitHub Integration
  - University Email Verification
- **Security Features**
  - Password Hashing (bcrypt)
  - Rate Limiting
  - CORS Protection

### Profile System

- **User Profiles**
  - Basic Information
    - Full Name
    - University
    - Major/Course
    - Year of Study
  - Academic Details
    - Course Schedule
    - Study Groups
    - Academic Achievements
  - Social Features
    - Skills Badge System
    - Endorsements
    - Connection Network

### Content Management

- **Post Types**
  - Text Posts
  - Media Posts (Images/Videos)
  - Academic Resources
  - Event Announcements
- **Interaction Features**
  - Likes and Comments
  - Share Functionality
  - Save for Later
- **Content Moderation**
  - Report System
  - Auto-moderation
  - Content Filtering

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or yarn
- MongoDB (local or Atlas URI)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/unisphere.git
   cd unisphere
   ```

2. Install server dependencies

   ```bash
   npm install
   ```

3. Install client dependencies

   ```bash
   cd client
   npm install
   ```

4. Create .env file in root directory

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

5. Create .env file in client directory
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

## 💻 Development

1. Start the development server

   ```bash
   # In root directory
   npm run dev
   ```

2. Start the client
   ```bash
   # In client directory
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🧪 Testing

### Frontend Testing

```bash
cd client
npm run test
```

- Unit Tests (Jest)
- Component Tests (React Testing Library)
- E2E Tests (Cypress)

### Backend Testing

```bash
npm run test:server
```

- API Tests (Supertest)
- Unit Tests (Mocha/Chai)
- Integration Tests

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**

   ```bash
   # Check MongoDB status
   mongo --eval "db.adminCommand('ping')"
   ```

2. **WebSocket Connection Errors**

   - Ensure correct WebSocket URL
   - Check firewall settings
   - Verify SSL certificates

3. **Build Problems**
   ```bash
   # Clear cache and node_modules
   rm -rf node_modules
   rm -rf client/node_modules
   npm cache clean --force
   ```

## 📊 Performance Optimization

### Frontend Optimization

- Code Splitting
- Lazy Loading
- Image Optimization
- Caching Strategies
- Bundle Size Analysis

### Backend Optimization

- Database Indexing
- Query Optimization
- Caching Layer (Redis)
- Load Balancing

## 🔐 Security Measures

- CSRF Protection
- XSS Prevention
- SQL Injection Protection
- Input Validation
- Rate Limiting
- Security Headers

## 📈 Monitoring

- Performance Metrics
- Error Tracking
- User Analytics
- Server Health Monitoring

## 🚢 Deployment

### Deploying to Render

1. Fork and push your code to GitHub

2. Create a Render account at [render.com](https://render.com)

3. In Render Dashboard:

   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository

4. Configure Environment Variables:

   ```
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   ```

5. Deploy:
   - Click "Create Blueprint"
   - Wait for the build process to complete
   - Access your app at: https://your-app-name.onrender.com

## 📁 Project Structure

```
unisphere/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── package.json
└── render.yaml
```

## 📚 API Documentation

API documentation is available at `/api/docs` when running the server locally.

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
