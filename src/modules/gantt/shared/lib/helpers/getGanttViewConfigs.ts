import {
  GanttViewValues,
  type GanttRecordType,
  type GanttViewConfig as ViewConfig,
} from '../models';

export const getGanttViewConfigs = (type: GanttRecordType): ViewConfig[] => {
  const views = [
    {
      view: 'day',
      value: GanttViewValues.DAY,
    },
    {
      view: 'week',
      value: GanttViewValues.WEEK,
    },
    {
      view: 'month',
      value: GanttViewValues.MONTH,
    },
    {
      view: 'quarter',
      value: GanttViewValues.QUARTER,
    },
    {
      view: 'half-year',
      value: GanttViewValues.HALF_YEAR,
    },
  ];

  if (type === 'task') {
    views.unshift(
      {
        view: 'fifteen-minutes',
        value: GanttViewValues.FIFTEEN_MINUTES,
      },
      {
        view: 'hour',
        value: GanttViewValues.HOUR,
      }
    );
  }

  return views as ViewConfig[];
};
