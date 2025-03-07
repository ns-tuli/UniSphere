import React, { useState } from 'react';
import Sidebar from "./MenuSidebar/Sidebar";
import TopBar from "./MenuTopbar/components/TopBar";
import Search from "./Search";
import Conversation from "./MenuConvo/Conversation";

const Menu = () => {
  const [text, setText] = useState('');
  return (
    <div className="flex">
      <Sidebar />
      <TopBar className="sidebar" />
      <Search setText={setText} />
      <Conversation text={text} />
    </div>
  );
}

export default Menu;
