import { useState, useEffect } from 'react';
import axios from 'axios';

const useLeaderboardData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/leaderboard');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch leaderboard data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Optional: Set up polling every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return { data, loading, error };
};

export default useLeaderboardData;
