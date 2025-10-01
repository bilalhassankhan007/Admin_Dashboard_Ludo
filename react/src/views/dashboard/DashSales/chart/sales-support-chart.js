export const SalesSupportChartData = {
  type: 'area',
  height: 85,
  options: {
    chart: {
      id: 'support-chart',
      sparkline: {
        enabled: true
      },
      background: 'transparent'
    },
    colors: ['#7267EF'],
    stroke: {
      curve: 'smooth',
      width: 2
    }
  },
  series: [
    {
      name: 'Tickets',
      data: [0, 20, 10, 45, 30, 55, 20, 30, 0]
    }
  ]
};
