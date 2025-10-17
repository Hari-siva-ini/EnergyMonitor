import React, { useState, useEffect, useRef } from 'react';

// SVG icons (simplified for example)
const icons = {
  home: (
    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2L2 10h3v6h4v-4h2v4h4v-6h3L10 2z" />
    </svg>
  ),
  hospital: (
    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 0v10h10v10H0V10h10V0h0zM9 5H7v2h2V5zm0 4H7v2h2V9zm4-4h-2v2h2V5zm0 4h-2v2h2V9z" />
    </svg>
  ),
  industry: (
    <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 2v16h16V2H2zm2 2h4v6H4V4zm6 0h4v10h-4V4zm6 0h2v14h-2V4z" />
    </svg>
  ),
  government: (
    <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 0L0 5l2 2v11h16V7l2-2-10-5zm0 2l8 4.5v10H2V6.5L10 2z" />
    </svg>
  )
};

const LoadManagement = () => {
  const simulatedConsumers = [
    { id: 1, name: 'Home', icon: icons.home, power: 50, isActive: false, scheduledTime: 0.1 },
    { id: 2, name: 'Hospital', icon: icons.hospital, power: 80, isActive: false, scheduledTime: 0.1 },
    { id: 3, name: 'Industry', icon: icons.industry, power: 120, isActive: false, scheduledTime: 0.1 },
    { id: 4, name: 'Government Office', icon: icons.government, power: 60, isActive: false, scheduledTime: 0.1 },
  ];

  const [consumers, setConsumers] = useState(simulatedConsumers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSwitching, setAutoSwitching] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (autoSwitching) {
      intervalRef.current = setInterval(() => {
        switchToNextConsumer();
      }, 6000);
    } else clearInterval(intervalRef.current);

    return () => clearInterval(intervalRef.current);
  }, [autoSwitching, currentIndex]);

  const switchToNextConsumer = () => {
    const nextIndex = (currentIndex + 1) % consumers.length;
    setConsumers(prev => prev.map((c, index) => ({ ...c, isActive: index === nextIndex })));
    setCurrentIndex(nextIndex);
  };

  const toggleConsumer = (id) => {
    setConsumers(prev => prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Load Management Simulation</h2>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setAutoSwitching(true)}
          disabled={autoSwitching}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Start Auto Switching
        </button>
        <button
          onClick={() => setAutoSwitching(false)}
          disabled={!autoSwitching}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          Stop Auto Switching
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {consumers.map(consumer => (
          <div
            key={consumer.id}
            className={`bg-white p-6 rounded-lg shadow transition transform hover:scale-105 ${
              consumer.isActive ? 'border-4 border-green-500' : ''
            }`}
          >
            <div className="flex items-center mb-4 space-x-4">
              {consumer.icon}
              <h3 className="text-lg font-semibold">{consumer.name}</h3>
              <div className={`w-4 h-4 rounded-full ${consumer.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Power: {consumer.power} W</p>
            <button
              onClick={() => toggleConsumer(consumer.id)}
              disabled={autoSwitching}
              className={`w-full py-2 rounded font-semibold text-white ${
                consumer.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } disabled:bg-gray-400`}
            >
              {consumer.isActive ? 'Turn OFF' : 'Turn ON'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadManagement;
