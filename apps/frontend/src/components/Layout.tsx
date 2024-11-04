import React from 'react';
import Sidebar from './SideBar';


export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex border-collapse">
      <Sidebar />
      <main className="flex-1 pt-[2rem] pb-1">
        {children}
      </main>
    </div>
  );
};
