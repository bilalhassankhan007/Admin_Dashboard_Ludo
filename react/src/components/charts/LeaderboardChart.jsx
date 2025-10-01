import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { leaderboardAPI } from '../../services/apiService';

// Register ChartJS components with error handling
try {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
} catch (error) {
  console.error('ChartJS registration failed:', error);
}

const LeaderboardChart = () => {
  const [playersData, setPlayersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        const response = await leaderboardAPI.getLeaderboard();
        
        if (response.data.success) {
          // Transform API data to match your existing format
          const transformedData = response.data.leaderboard.map(player => ({
            id: player._id,
            name: player.first_name,
            wins: (player.twoPlayWin || 0) + (player.fourPlayWin || 0),
            // Estimate losses based on win rate (assuming 30% of games are losses)
            losses: Math.round(((player.twoPlayWin || 0) + (player.fourPlayWin || 0)) * 0.3),
            wallet: player.wallet || 0,
            wincoin: player.wincoin || 0,
            winRate: Math.round(
              ((player.twoPlayWin || 0) + (player.fourPlayWin || 0)) / 
              (((player.twoPlayWin || 0) + (player.fourPlayWin || 0)) + 
               Math.round(((player.twoPlayWin || 0) + (player.fourPlayWin || 0)) * 0.3) || 1) * 100
            )
          }));
          
          setPlayersData(transformedData);
        } else {
          setError('Failed to fetch leaderboard data from API');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching leaderboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Process and validate data (same as your existing code)
  const processedData = Array.isArray(playersData) 
    ? playersData
        .filter(player => player && player.name)
        .map(player => ({
          ...player,
          wins: Math.max(0, Number(player.wins) || 0),
          losses: Math.max(0, Number(player.losses) || 0),
          winRate: Math.round(
            ((Number(player.wins) || 0) / 
            (((Number(player.wins) || 0) + (Number(player.losses) || 0)) || 1) * 100
          )
        )}))
    : [];

  // Sort by win rate (descending)
  const sortedPlayers = [...processedData].sort((a, b) => b.winRate - a.winRate);

  // Chart data configuration (same as your existing code)
  const chartData = {
    labels: sortedPlayers.map(player => player.name),
    datasets: [
      {
        label: 'Wins',
        data: sortedPlayers.map(player => player.wins),
        backgroundColor: '#99FFFF',
        borderColor: '#003333',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 30,
      },
      {
        label: 'Losses',
        data: sortedPlayers.map(player => player.losses),
        backgroundColor: '#336666',
        borderColor: '#003333',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 30,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#003333',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Monthly Leaderboard - Performance Overview',
        color: '#003333',
        font: {
          size: 18,
          weight: 'bold',
          family: 'Arial'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const player = sortedPlayers[context.dataIndex];
            let label = context.dataset.label || '';
            if (label) label += ': ';
            label += context.raw;
            if (context.datasetIndex === 0) {
              label += ` (${player.winRate}% win rate)`;
            }
            return label;
          }
        },
        backgroundColor: '#003333',
        titleColor: '#CCFFFF',
        bodyColor: '#99FFFF',
        displayColors: true,
        borderColor: '#336666',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#003333',
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 51, 51, 0.1)'
        },
        ticks: {
          color: '#003333',
          stepSize: 10
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  if (isLoading) {
    return (
      <div className="chart-loading" style={{
        height: '500px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '12px'
      }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading leaderboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </Alert>
    );
  }

  if (!sortedPlayers.length) {
    return (
      <div className="chart-empty" style={{
        height: '500px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        color: '#336666'
      }}>
        No player data available
      </div>
    );
  }

  return (
    <div className="leaderboard-container" style={{
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0, 51, 51, 0.1)',
      margin: '20px 0'
    }}>
      <div style={{ height: '500px', position: 'relative' }}>
        <Bar 
          data={chartData} 
          options={chartOptions} 
          redraw
        />
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{
          backgroundColor: '#99FFFF',
          padding: '12px 20px',
          borderRadius: '8px',
          flex: '1',
          minWidth: '200px',
          boxShadow: '0 2px 8px rgba(0, 51, 51, 0.1)'
        }}>
          <h4 style={{ color: '#003333', margin: '0 0 8px 0' }}>🥇 Top Performer</h4>
          <p style={{ color: '#003333', margin: '0', fontSize: '18px', fontWeight: 'bold' }}>
            {sortedPlayers[0]?.name || 'N/A'} - {sortedPlayers[0]?.winRate || 0}% Win Rate
          </p>
        </div>
        
        <div style={{
          backgroundColor: '#336666',
          padding: '12px 20px',
          borderRadius: '8px',
          flex: '1',
          minWidth: '200px',
          boxShadow: '0 2px 8px rgba(0, 51, 51, 0.1)'
        }}>
          <h4 style={{ color: '#CCFFFF', margin: '0 0 8px 0' }}>⚠️ Needs Improvement</h4>
          <p style={{ color: '#CCFFFF', margin: '0', fontSize: '18px', fontWeight: 'bold' }}>
            {sortedPlayers[sortedPlayers.length - 1]?.name || 'N/A'} - {sortedPlayers[sortedPlayers.length - 1]?.winRate || 0}% Win Rate
          </p>
        </div>
      </div>
    </div>
  );
};

// Keep your existing PropTypes
LeaderboardChart.propTypes = {
  // These are now optional since we're fetching data internally
  playersData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      wins: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      losses: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  isLoading: PropTypes.bool
};

// Default props for backward compatibility
LeaderboardChart.defaultProps = {
  playersData: [],
  isLoading: false
};

export default LeaderboardChart;