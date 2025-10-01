import { useContext, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConfigContext } from '../../contexts/ConfigContext';
import useWindowSize from '../../hooks/useWindowSize';
import * as actionType from '../../store/actions';

// Components
import MobileHeader from './MobileHeader';
import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';
import Loader from '../../components/Loader';
import ThemeToggle from '../../components/ThemeToggle';

const AdminLayout = () => {
  const windowSize = useWindowSize();
  const { theme } = useContext(ThemeContext);
  const { state: config, dispatch } = useContext(ConfigContext);
  
  useEffect(() => {
    // Handle responsive menu collapse
    if (windowSize.width > 992 && windowSize.width <= 1024) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
    
    // Apply theme class to body
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('minimenu', config.collapseLayout);
    
    return () => {
      document.body.classList.remove('dark-theme', 'minimenu');
    };
  }, [windowSize, theme, config.collapseLayout, dispatch]);

  return (
    <div className={`app-container ${theme}-theme`} data-theme={theme}>
      <MobileHeader />
      <NavBar />
      <Navigation />
      
      <div className={`pc-container ${config.collapseMenu ? 'menu-collapsed' : ''}`}>
        <div className="pcoded-content">
          <Breadcrumb />
          <Suspense fallback={<Loader fullscreen />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
      
      <ThemeToggle fixed />
    </div>
  );
};

export default AdminLayout;