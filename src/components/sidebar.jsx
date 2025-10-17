import React from 'react';

const Sidebar = ({ userRole, activeComponent, setActiveComponent }) => {
  const userComponents = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'power-monitoring', name: 'Power Monitoring', icon: '⚡' },
    { id: 'load-management', name: 'My Loads', icon: '🔌' },
    { id: 'bill', name: 'Electric Bill', icon: '💰' }
  ];
  const components = userComponents;
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Power Monitor</h2>
      <nav>
        {components.map((component) => (
          <button
            key={component.id}
            onClick={() => setActiveComponent(component.id)}
            className={`w-full text-left p-3 mb-2 rounded flex items-center space-x-3 transition-colors ${
              activeComponent === component.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{component.icon}</span>
            <span>{component.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;