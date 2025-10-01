import Chart from 'react-apexcharts';

const BarChart = ({ data, title }) => {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#3F51B5'],
    plotOptions: {
      bar: { borderRadius: 4, horizontal: true }
    },
    xaxis: {
      categories: data.map(item => item.range),
      labels: {
        formatter: (val) => `₹${val}`
      }
    },
    title: { text: title, align: 'left' }
  };

  const series = [{
    name: 'Players',
    data: data.map(item => item.count)
  }];

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default BarChart;