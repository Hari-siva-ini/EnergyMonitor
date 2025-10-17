// src/App.js
import React, { useState } from 'react';
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/sidebar";
import PowerMonitoring from "./components/PowerMonitoring";
import ElectricBill from "./components/ElectricBill";
import LoadManagement from "./components/LoadManagement";
import SolarEnergy from "./components/SolarEnergy";

function App() {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'power-monitoring':
        return <PowerMonitoring />;
      case 'load-management':
        return <LoadManagement />;
      case 'bill':
        return <ElectricBill />;
      case 'solar':
        return <SolarEnergy />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <div className="flex-none w-64">
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>
      <div className="flex-1 p-9 overflow-auto">
        {renderComponent()}
      </div>
    </div>
  );
}

export default App;
