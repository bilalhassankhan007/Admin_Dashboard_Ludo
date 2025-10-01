import { FaUsers, FaWallet, FaDownload, FaCalendarAlt, FaGamepad } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { authUtils } from '../../../utils/auth';

const AnimatedCards = ({ 
  metrics = {
    activePlayers: 1245,
    totalBidAmount: 1230450,
    totalDownloads: 48000,
    dailyAverageIncome: 8500
  }, 
  refreshInterval = 30000 
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    activePlayers: 0,
    totalBidAmount: 0,
    dailyAverageIncome: 0,
    totalDownloads: 0
  });
  const [isAuthenticated, setIsAuthenticated] = useState(authUtils.isAuthenticated());

  // Add authentication check
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authUtils.isAuthenticated());
    };

    checkAuth();
    
    const handleAuthChange = () => checkAuth();
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, []);

  // Don't animate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl p-5 bg-gray-100 shadow-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-500">Loading...</p>
                <p className="text-2xl font-bold text-gray-400">--</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Simulate real-time player count updates
  useEffect(() => {
    let intervalId;
    
    const updateLivePlayers = () => {
      // Random fluctuation to simulate live changes (replace with actual API call)
      const fluctuation = Math.floor(Math.random() * 20) - 10;
      const baseValue = metrics?.activePlayers ?? 1245;
      const newValue = Math.max(0, baseValue + fluctuation);
      
      setAnimatedValues(prev => ({
        ...prev,
        activePlayers: newValue
      }));
    };

    if (metrics?.activePlayers !== undefined && isAuthenticated) {
      updateLivePlayers();
      intervalId = setInterval(updateLivePlayers, refreshInterval);
    }

    return () => clearInterval(intervalId);
  }, [metrics?.activePlayers, refreshInterval, isAuthenticated]);

  // Animation effect for other metrics
  useEffect(() => {
    if (!isAuthenticated) return;

    const animateValue = (key, target) => {
      let current = animatedValues[key];
      const steps = 30;
      const increment = (target - current) / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        current += increment;
        step++;
        
        if (step >= steps) {
          current = target;
          clearInterval(timer);
        }
        
        setAnimatedValues(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, 50);
    };

    animateValue('totalBidAmount', metrics?.totalBidAmount ?? 1230450);
    animateValue('dailyAverageIncome', metrics?.dailyAverageIncome ?? 8500);
    animateValue('totalDownloads', metrics?.totalDownloads ?? 48000);
  }, [metrics, animatedValues, isAuthenticated]);

  const cards = [
    { 
      title: 'Live Players', 
      value: animatedValues.activePlayers.toLocaleString('en-IN'), 
      icon: <FaGamepad className="text-4xl text-blue-600" />, 
      bg: 'bg-blue-100',
      description: 'Currently in active matches',
      pulse: true
    },
    { 
      title: 'Total Bids', 
      value: `₹${animatedValues.totalBidAmount.toLocaleString('en-IN')}`, 
      icon: <FaWallet className="text-4xl text-green-600" />, 
      bg: 'bg-green-100',
      description: 'Total bids in active matches'
    },
    { 
      title: 'Total Downloads', 
      value: animatedValues.totalDownloads.toLocaleString('en-IN'), 
      icon: <FaDownload className="text-4xl text-purple-600" />, 
      bg: 'bg-purple-100',
      description: 'Cumulative app installs'
    },
    { 
      title: 'Daily Average Income', 
      value: `₹${animatedValues.dailyAverageIncome.toLocaleString('en-IN')}`, 
      icon: <FaCalendarAlt className="text-4xl text-red-600" />, 
      bg: 'bg-red-100',
      description: '30-day revenue average'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <motion.div
          key={`${card.title}-${index}`}
          className={`rounded-xl p-5 ${card.bg} shadow-md hover:shadow-lg transition-shadow relative ${
            card.pulse ? 'animate-pulse-slow' : ''
          }`}
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm">{card.icon}</div>
            <div>
              <p className="text-lg font-semibold text-gray-700">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              {card.description && (
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              )}
            </div>
          </div>
          {card.pulse && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

AnimatedCards.propTypes = {
  metrics: PropTypes.shape({
    activePlayers: PropTypes.number,
    totalBidAmount: PropTypes.number,
    totalDownloads: PropTypes.number,
    dailyAverageIncome: PropTypes.number
  }),
  refreshInterval: PropTypes.number
};

export default AnimatedCards;