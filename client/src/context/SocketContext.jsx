import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = io("http://localhost:9001");

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
