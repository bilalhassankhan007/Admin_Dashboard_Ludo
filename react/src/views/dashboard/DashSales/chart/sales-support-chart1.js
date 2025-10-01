export const SalesSupportChartData1 = {
  height: 85,
  type: 'bar',
  options: {
    chart: {
      id: 'support-chart-1',
      sparkline: {
        enabled: true
      },
      background: 'transparent'
    },
    colors: ['#7267EF'],
    plotOptions: {
      bar: {
        columnWidth: '70%',
        borderRadius: 4
      }
    }
  },
  series: [
    {
      name: 'Data',
      data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54]
    }
  ]
};
