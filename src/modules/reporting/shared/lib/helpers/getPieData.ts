import type { ChartData, ChartOptions } from 'chart.js';
import { pieBGColors, type TopSellerData } from '../models';
import { externalTooltip } from './externalTooltip';

export const getPieData = (topSellers: TopSellerData[]): ChartData<'pie'> => ({
  labels: topSellers.map(
    ts => `${ts.avatar ?? ''}|${ts.initials ?? ''}|${ts.userName}|${ts.percent}%|${ts.value}`
  ),
  datasets: [
    {
      data: topSellers.map(ts => ts.value),
      backgroundColor: pieBGColors,
      borderColor: 'white',
      borderWidth: 1,
    },
  ],
});

export const getPieOptions = (isAmount: boolean): ChartOptions<'pie'> => ({
  radius: 80,
  cutout: 20,
  plugins: {
    tooltip: {
      enabled: false,
      external: context => externalTooltip({ context, isAmount }),
    },
    legend: {
      display: false,
    },
  },
});
