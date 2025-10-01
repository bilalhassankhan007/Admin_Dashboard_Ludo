import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const AreaChart = ({ data, title, loading }) => {
  const options = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#4CAF50'],
    dataLabels: { enabled: false },
    stroke: { 
      curve: 'smooth', 
      width: 2,
      colors: ['#4CAF50'] 
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: data.map(item => 
        new Date(item.date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => `₹${val.toLocaleString('en-IN')}`,
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      y: { 
        formatter: (val) => `₹${val.toLocaleString('en-IN')}` 
      }
    },
    title: { 
      text: title, 
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 3
    }
  };

  const series = [{
    name: 'Revenue',
    data: data.map(item => item.amount)
  }];

  if (loading) {
    return (
      <div style={{ 
        height: 350, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #eee',
        borderRadius: '8px'
      }}>
        <div>Loading chart data...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #eee', 
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <Chart 
        options={options} 
        series={series} 
        type="area" 
        height={350} 
      />
    </div>
  );
};

// Demo component with dummy data
export const AreaChartDemo = () => {
  const dummyData = [
    { date: '2023-06-01', amount: 25000 },
    { date: '2023-06-02', amount: 32000 },
    { date: '2023-06-03', amount: 18000 },
    { date: '2023-06-04', amount: 41000 },
    { date: '2023-06-05', amount: 37000 },
    { date: '2023-06-06', amount: 29000 },
    { date: '2023-06-07', amount: 45000 },
    { date: '2023-06-08', amount: 52000 },
    { date: '2023-06-09', amount: 48000 },
    { date: '2023-06-10', amount: 39000 }
  ];

  return (
    <AreaChart 
      title="Daily Revenue (Demo Data)" 
      data={dummyData}
      loading={false}
    />
  );
};

// Component with API integration
export const AreaChartWithAPI = ({ apiUrl }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Transform API data to match expected format
        const formattedData = data.map(item => ({
          date: item.date, // Assuming your API returns date field
          amount: item.amount // Assuming your API returns amount field
        }));
        
        setChartData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (error) {
    return (
      <div style={{ 
        height: 350, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #eee',
        borderRadius: '8px',
        color: 'red'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <AreaChart 
      title="Revenue Data" 
      data={chartData}
      loading={loading}
    />
  );
};

export default AreaChart;