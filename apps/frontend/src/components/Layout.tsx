import React from 'react';
import Sidebar from './SideBar';
import { windowSizeLessThan960 } from '@repo/store/window.ts';
import { useRecoilValue } from 'recoil';


export const Layout = ({ children }: { children: React.ReactNode }) => {

  const windowisGreater960 = useRecoilValue(windowSizeLessThan960)

  return (
    <div className={`${ !windowisGreater960 ? "flex" : ""}`}>
      <Sidebar />
      <main className={`pt-[2rem] pb-1 ${ !windowisGreater960 ? "flex-1" : ""}`}>
        {children}
      </main>
    </div>
  );
};
