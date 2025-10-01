import Chart from 'react-apexcharts';

const DonutChart = ({ data, title }) => {
  const options = {
    chart: {
      type: 'donut',
      height: 350
    },
    colors: ['#FF6384', '#36A2EB', '#FFCE56'],
    labels: data.map(item => item.platform),
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 200 } }
    }],
    title: { text: title, align: 'left' },
    legend: { position: 'right' }
  };

  const series = data.map(item => 
    parseInt(item.share.replace('%', ''))
  );

  return <Chart options={options} series={series} type="donut" height={350} />;
};

export default DonutChart;