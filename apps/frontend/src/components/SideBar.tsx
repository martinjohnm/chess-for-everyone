
import React, { useEffect, useState } from 'react';
import { FaChessKnight } from 'react-icons/fa';
import { FiHome, FiSettings, FiUser } from 'react-icons/fi';
import ThemeToggleButton from './ThemeToggleButton';
import { useRecoilState, useRecoilValue } from 'recoil';
import { windowSizeAtom, windowSizeLessThan960 } from '@repo/store/window.ts';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);


  const windowisGreater960 = useRecoilValue(windowSizeLessThan960)
  const [windowSize, setWindowSize] = useRecoilState(windowSizeAtom)
  
  useEffect(() => {
    const handleResize = () => {
        setWindowSize({
          width : window.innerWidth,
          height : window.innerHeight
        })
      }

      window.addEventListener('resize', handleResize);

      // Clean up event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };

  }, [windowSize])
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (windowisGreater960) {
    return (
            

      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Chess</span>
          <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Services</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Pricing</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    )
  }

  
  return (
    <div className={`flex ${isCollapsed ? 'w-14' : 'w-50'} sticky top-0 p-4 transition-width duration-300 bg-slate-300 h-screen text-black dark:text-white dark:bg-[#262522]`}>
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

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, isCollapsed}) => {

  return (
    <div className="flex items-center space-x-4 mb-4 text-black dark:text-white hover:text-white">
      <span className="text-xl">{icon}</span>
      {!isCollapsed && <span className="text-base">{label}</span>}
    </div>
  );
};

export default Sidebar;
