import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { Sun, Moon } from 'react-feather';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeToggle = ({ fixed = false, showText = true }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`theme-toggle ${fixed ? 'fixed' : ''}`}>
      <Button 
        variant="outline-secondary" 
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="rounded-circle p-2"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        {showText && (
          <span className="ms-2 d-none d-sm-inline">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        )}
      </Button>
    </div>
  );
};

export default ThemeToggle;