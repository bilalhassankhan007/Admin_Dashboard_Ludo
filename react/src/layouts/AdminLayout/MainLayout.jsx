import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConfigContext } from '../../contexts/ConfigContext';

// Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Breadcrumb from '../../components/Breadcrumb';
import ThemeToggle from '../../components/ThemeToggle';

const MainLayout = () => {
  const { theme } = useContext(ThemeContext);
  const { state: config } = useContext(ConfigContext);

  return (
    <div className={`app-container ${theme}-theme`} data-theme={theme}>
      {/* Preloader - uncomment if needed */}
      {/* <div className="preloader">
        <div className="loader">
          <div className="spinner"></div>
        </div>
      </div> */}

      <div className={`page-wrapper ${config.collapseMenu ? 'close_icon' : ''}`}>
        {/* Header */}
        <Header />
        
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="page-body-wrapper">
          <div className="page-body">
            {/* Breadcrumb */}
            <Breadcrumb />
            
            {/* Page Content */}
            <div className="container-fluid">
              <Outlet /> {/* This renders your route components */}
            </div>
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Theme Toggle - Position it where you prefer */}
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default MainLayout;