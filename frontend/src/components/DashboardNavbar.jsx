import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Hola, {user?.username}</span>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default DashboardNavbar;
