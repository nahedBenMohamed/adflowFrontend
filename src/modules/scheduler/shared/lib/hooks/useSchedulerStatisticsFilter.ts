import { SettingsStore } from '@/app';
import type { Nullable } from '@/shared';
import { useCallback, useState } from 'react';
import type {
  ScheduleAppointmentStatisticsType,
  SchedulerStatisticsFilterSettings,
} from '../models';

type UseSchedulerStatisticsFilter = [
  Nullable<ScheduleAppointmentStatisticsType>,
  (statisticsFilter: Nullable<ScheduleAppointmentStatisticsType>) => void,
];

const SCHEDULER_STATISTICS_FILTER_SETTINGS_KEY = 'SchedulerStatisticsFilterSettings';

const { settings: statisticsFilterSettings } =
  SettingsStore.getSettingsStore<SchedulerStatisticsFilterSettings>(
    SCHEDULER_STATISTICS_FILTER_SETTINGS_KEY
  );

if (!statisticsFilterSettings.filters) statisticsFilterSettings.filters = [];

export const useSchedulerStatisticsFilter = (scheduleId: number): UseSchedulerStatisticsFilter => {
  const statisticsFilterFromLS = statisticsFilterSettings.filters.find(
    s => s.scheduleId === scheduleId
  );

  const [statisticsFilter, setStatisticsFilter] = useState<
    Nullable<ScheduleAppointmentStatisticsType>
  >(statisticsFilterFromLS?.filter ?? null);

  const handleSetStatisticsFilter = useCallback(
    (statisticsFilter: Nullable<ScheduleAppointmentStatisticsType>) => {
      setStatisticsFilter(statisticsFilter);

      const filterFromLS = statisticsFilterSettings.filters.find(s => s.scheduleId === scheduleId);

      if (filterFromLS) {
        statisticsFilterSettings.filters = statisticsFilterSettings.filters.filter(
          s => s.scheduleId !== scheduleId
        );
      }

      if (statisticsFilter !== null) {
        statisticsFilterSettings.filters.push({ scheduleId, filter: statisticsFilter });
      }
    },
    [scheduleId]
  );

  return [statisticsFilter, handleSetStatisticsFilter];
};
