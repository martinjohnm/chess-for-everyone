
import React, { useEffect, useState } from 'react';
import { FaChessKnight, FaGamepad } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IoIosLogOut } from "react-icons/io";
import { CiLogin } from "react-icons/ci";

import { useNavigate } from 'react-router-dom';
import { windowSizeAtom, windowSizeLessThan960 } from '../store/src/atoms/window';
import { useUser } from '../store/src/hooks/useUser';
const Sidebar  = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = useUser()
  const be_url = import.meta.env.VITE_APP_BACKEND_URL
  
  const windowisGreater960 = useRecoilValue(windowSizeLessThan960)
  const [windowSize, setWindowSize] = useRecoilState(windowSizeAtom)
  const navigate = useNavigate()

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
            

      <nav className="bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Chess</span>
         
          <div className='text-white'>
            home
          </div>
          <div className='text-white'>
            games
          </div>
          

        </div>
      </nav>

    )
  }


  const logout = async() => {

      try {
        await fetch(be_url + `/auth/logout`,{
          method : "get",
          headers : {"Content-Type" : "application/json"},
          credentials : "include",
          })
        
        navigate("/")
        
        
      } catch (error) {
        
      }

  }

  
  return (
    <div className={`flex ${isCollapsed ? 'w-14' : 'w-50'} sticky top-0 p-4 transition-width duration-300 h-screen text-white bg-[#262522]`}>
      <div className="flex flex-col justify-between h-full">
        {/* Sidebar Header */}
        <div>
          <button onClick={toggleSidebar} className="text-xl mb-4">
            <FaChessKnight />
          </button>

          {/* Navigation Links */}
          <nav>
            <div onClick={() => {
              navigate("/")
            }}>
              <SidebarLink icon={<FiHome />} label="Home" isCollapsed={isCollapsed} />
            </div>
            <div onClick={() => {
              navigate("/games")
            }}>
              <SidebarLink icon={<FaGamepad />} label="Games" isCollapsed={isCollapsed} /> 
            </div> 

            { user &&
            <div onClick={logout}>
              <SidebarLink icon={user ? <IoIosLogOut /> : <CiLogin/>} label={`${user ? "Logout" : "Login"}`} isCollapsed={isCollapsed} /> 
            </div> }

            { !user &&
            <div onClick={() => {
              navigate("/login")
            }}>
              <SidebarLink icon={user ? <IoIosLogOut /> : <CiLogin/>} label={`${user ? "Logout" : "Login"}`} isCollapsed={isCollapsed} /> 
            </div> }
            
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

const SidebarLink = ({ icon, label, isCollapsed} : SidebarLinkProps) => {
  return (
    <div className="flex items-center space-x-4 mb-4 text-slate-100 cursor-pointer hover:text-blue-300" >
      <span className="text-xl">{icon}</span>
      {!isCollapsed && <span className="text-base">{label}</span>}
    </div>
  );
};

export default Sidebar;
