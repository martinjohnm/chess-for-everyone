


// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { FaChessKnight } from 'react-icons/fa';
import { FiHome, FiSettings, FiUser } from 'react-icons/fi';
import ThemeToggleButton from './ThemeToggleButton';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex ${isCollapsed ? 'w-20' : 'w-54'} p-4 transition-width duration-300 bg-slate-300 h-screen text-black dark:text-white dark:bg-gray-800`}>
      <div className="flex flex-col justify-between h-full">
        {/* Sidebar Header */}
        <div>
          <button onClick={toggleSidebar} className="text-xl mb-4">
            <FaChessKnight />
          </button>

          {/* Navigation Links */}
          <nav>
            <SidebarLink icon={<FiHome />} label="Home" isCollapsed={isCollapsed} />
            <SidebarLink icon={<FiUser />} label="Profile" isCollapsed={isCollapsed} />
            <SidebarLink icon={<FiSettings />} label="Settings" isCollapsed={isCollapsed} />
            <ThemeToggleButton />
          </nav>
        </div>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, isCollapsed }) => {
  return (
    <div className="flex items-center space-x-4 mb-4 text-black dark:text-white hover:text-white">
      <span className="text-xl">{icon}</span>
      {!isCollapsed && <span className="text-base">{label}</span>}
    </div>
  );
};

export default Sidebar;
