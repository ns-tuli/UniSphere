//path: client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';

// In main.jsx
const clientId = "651169042818-809bto6tomeio06m8ah23v07307v7met.apps.googleusercontent.com"; // Use your correct client ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <SocketProvider>
    <UserProvider>
      <App />
      </UserProvider>
      </SocketProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
