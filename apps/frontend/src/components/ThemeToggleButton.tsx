// src/components/ThemeToggleButton.tsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

import { FaRegMoon } from "react-icons/fa";
import { FaRegSun } from "react-icons/fa6";

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {theme === 'light' ? <FaRegMoon/> : <FaRegSun/>}
    </button>
  );
};

export default ThemeToggleButton;
