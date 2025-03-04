import React from 'react';
import { ToastContainer } from 'react-toastify';
import BusMap from './components/BusMap';

function App() {
  return (
    <div className="App">
      <h1>Bus Tracking System</h1>
      <BusMap />
      <ToastContainer />
    </div>
  );
}

export default App;
