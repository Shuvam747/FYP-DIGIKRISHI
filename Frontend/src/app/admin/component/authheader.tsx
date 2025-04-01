// components/AdminHeader.tsx
import React from 'react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="flex items-center justify-between bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold">Admin Page</h1>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
      >
        Logout
      </button>
    </header>
  );
};
