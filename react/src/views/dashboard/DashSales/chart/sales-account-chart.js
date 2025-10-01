// src/views/dashboard/DashSales/chart/sales-account-chart.js
export const SalesAccountChartData = {
  options: {
    chart: {
      id: 'financial-performance-chart',
      type: 'bar',
      stacked: true,
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
      events: {
        dataPointSelection: function (event, chartContext, config) {
          const month = config.w.config.xaxis.categories[config.dataPointIndex];
          const totalRevenue = config.w.config.series[0].data[config.dataPointIndex];
          alert(`Total Revenue for ${month}: ₹${totalRevenue.toLocaleString('en-IN')}`);
        }
      }
    },
    colors: ['#ADD8E6', '#B0E0E6', '#AFEEEE'], // Updated colors
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: false,
        columnWidth: '70%',
        dataLabels: {
          position: 'top',
          hideOverflowingLabels: true
        }
      }
    },
    dataLabels: {
      enabled: false, // Disabled numeric value on bars
      formatter: function (val) {
        return '₹' + val.toLocaleString('en-IN');
      },
      style: {
        colors: ['#FFFFFF'],
        fontSize: '10px',
        fontWeight: 'bold'
      },
      offsetY: -20,
      dropShadow: {
        enabled: false
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#000000',
          fontSize: '12px',
          fontWeight: 600
        }
      },
      axisBorder: {
        show: true,
        color: '#87CEFA'
      },
      axisTicks: {
        show: true,
        color: '#FF0000'
      },
      title: {
        text: 'Months',
        style: {
          color: '#2c3e50',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return '₹' + val.toLocaleString('en-IN');
        },
        style: {
          colors: '#2c3e50',
          fontSize: '12px',
          fontWeight: 600
        }
      },
      title: {
        text: 'Amount (₹)',
        style: {
          color: '#2c3e50',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return '₹' + val.toLocaleString('en-IN');
        }
      },
      style: {
        fontSize: '12px'
      }
    },
    grid: {
      borderColor: '#A9A9A9',
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
    fill: {
      opacity: 1
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 500
          },
          legend: {
            position: 'bottom',
            offsetY: 0
          },
          plotOptions: {
            bar: {
              columnWidth: '50%'
            }
          },
          dataLabels: {
            enabled: false
          }
        }
      }
    ]
  },
  series: []
};
