// src/views/dashboard/DashSales/chart/downloads-over-time-chart.js
export const DownloadsOverTimeChartData = {
  options: {
    chart: {
      id: 'downloads-over-time-chart',
      type: 'line',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      foreColor: '#2c3e50',
      zoom: {
        enabled: false
      }
    },
    colors: ['#FFFF00', '#8A2BE2', '#00FF00'], // Android, iOS, Total
    stroke: {
      curve: 'smooth',
      width: [3, 3, 4], // Thicker line for total downloads
      dashArray: [0, 0, 0] // All solid lines
    },
    markers: {
      size: [5, 5, 6], // Slightly larger markers for total
      hover: {
        size: 7
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toLocaleString();
        },
        style: {
          colors: '#6B7280'
        }
      },
      title: {
        text: 'Downloads',
        style: {
          color: '#6B7280'
        }
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val, { seriesIndex }) {
          // Removed unused parameters
          const platform = ['Android', 'iOS', 'Total'][seriesIndex];
          return `${val.toLocaleString()} (${platform})`;
        }
      },
      marker: {
        show: true
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -10,
      labels: {
        colors: '#2c3e50',
        useSeriesColors: false
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
        offsetX: -5
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 500,
            toolbar: {
              offsetY: 0
            }
          },
          legend: {
            position: 'bottom',
            offsetY: 0
          }
        }
      }
    ]
  },
  series: [
    {
      name: 'Android Downloads',
      data: [18000, 22000, 19500, 23000, 25000, 21500, 27000, 29000, 25500, 31000, 28500, 32000]
    },
    {
      name: 'iOS Downloads',
      data: [8000, 9500, 7000, 8500, 11000, 9000, 11500, 12500, 10000, 14000, 12000, 15000]
    },
    {
      name: 'Total Downloads',
      data: [26000, 31500, 26500, 31500, 36000, 30500, 38500, 41500, 35500, 45000, 40500, 47000]
    }
  ]
};

// For API integration later
export const fetchDownloadStats = async () => {
  /* 
  Replace this with your actual API call when ready:
  
  const response = await fetch('your-api-endpoint');
  return await response.json();
  */

  return {
    android: [18000, 22000, 19500, 23000, 25000, 21500, 27000, 29000, 25500, 31000, 28500, 32000],
    ios: [8000, 9500, 7000, 8500, 11000, 9000, 11500, 12500, 10000, 14000, 12000, 15000],
    total: [26000, 31500, 26500, 31500, 36000, 30500, 38500, 41500, 35500, 45000, 40500, 47000]
  };
};

export const transformDownloadData = (apiData) => {
  return [
    {
      name: 'Android Downloads',
      data: apiData.android || []
    },
    {
      name: 'iOS Downloads',
      data: apiData.ios || []
    },
    {
      name: 'Total Downloads',
      data: apiData.total || []
    }
  ];
};
