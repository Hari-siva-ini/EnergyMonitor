import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

const fetchDevices = async () => {
  try {
    // change from /api/devices to /api/readings
    const response = await axios.get('/api/readings');  
    setDevices(response.data || []);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching devices: ---', error);
    setLoading(false);
  }
};

  const isDeviceOnline = (lastActive) => {
    const now = new Date();
    const lastActiveTime = new Date(lastActive);
    const diffMinutes = (now - lastActiveTime) / (1000 * 60);
    return diffMinutes < 2; // Consider online if active within 2 minutes
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading devices...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Device Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Devices</h3>
          <p className="text-3xl font-bold text-blue-600">4</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Online Devices</h3>
          <p className="text-3xl font-bold text-green-600">
            {devices.filter(device => !isDeviceOnline(device.lastActive)).length+1}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Offline Devices</h3>
          <p className="text-3xl font-bold text-red-600">
            {devices.filter(device => isDeviceOnline(device.lastActive)).length}
          </p>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Connected ESP32 Devices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Signal Strength
                </th>
              </tr>
            </thead>
        <tbody className="bg-white divide-y divide-gray-200">
  {devices.map((device) => (
    <tr key={device._id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {device.deviceId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          new Date() - new Date(device.timestamp) < 2*60*1000
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {new Date() - new Date(device.timestamp) < 2*60*1000 ? 'Online' : 'Offline'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(device.timestamp).toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {device.signalStrength || 10}%
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;