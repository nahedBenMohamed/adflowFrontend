import { type ChartData, type ChartOptions } from 'chart.js';
import { doughnutBGColors, doughnutBorderColors, type TopSellerData } from '../models';
import { externalTooltip } from './externalTooltip';

export const getDoughnutData = (topSellers: TopSellerData[]): ChartData<'doughnut'> => ({
  labels: topSellers.map(
    ts => `${ts.avatar ?? ''}|${ts.initials ?? ''}|${ts.userName}|${ts.percent}%|${ts.value}`
  ),
  datasets: [
    {
      type: 'doughnut',
      data: topSellers.map(ts => ts.value),
      backgroundColor: doughnutBGColors,
      borderColor: doughnutBorderColors,
      borderWidth: 1,
    },
  ],
});

export const getDoughnutOptions = (isAmount: boolean): ChartOptions<'doughnut'> => ({
  radius: 112,
  cutout: 104,
  plugins: {
    tooltip: {
      enabled: false,
      animation: false,

      external: context => externalTooltip({ context, isAmount }),
    },
    legend: {
      display: false,
    },
  },
});
