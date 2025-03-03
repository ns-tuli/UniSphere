import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Chatbot from './Chatbot';

function Layout() {
  return (
    <div>
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <Chatbot />
    </div>
  );
}

export default Layout;
