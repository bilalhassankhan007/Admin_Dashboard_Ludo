export const SalesCustomerSatisfactionChartData = {
  height: 260,
  type: 'pie',
  options: {
    chart: {
      id: 'satisfaction-chart',
      background: 'transparent'
    },
    labels: ['Extremely Satisfied', 'Satisfied', 'Poor', 'Very Poor'],
    legend: {
      position: 'right',
      offsetY: 50,
      itemMargin: {
        vertical: 5
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      dropShadow: {
        enabled: false
      }
    }
  },
  series: [66, 50, 40, 30]
};
