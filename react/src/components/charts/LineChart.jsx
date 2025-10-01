import Chart from 'react-apexcharts';

const LineChart = ({ wins, losses, title }) => {
  const options = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#4CAF50', '#F44336'],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: wins.map(item => 
        new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }))
    },
    title: { text: title, align: 'left' },
    legend: { position: 'top' }
  };

  const series = [
    { name: 'Wins', data: wins.map(item => item.value) },
    { name: 'Losses', data: losses.map(item => item.value) }
  ];

  return <Chart options={options} series={series} type="line" height={350} />;
};

export default LineChart;