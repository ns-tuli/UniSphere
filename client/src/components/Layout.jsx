import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Chatbot from './Chatbot';

function Layout() {
  return (
    <div>
      <Header />
      <main className="pt-16"> {/* Add padding to account for fixed header */}
        <Outlet />
      </main>
      <Chatbot />
    </div>
  );
}

export default Layout;
