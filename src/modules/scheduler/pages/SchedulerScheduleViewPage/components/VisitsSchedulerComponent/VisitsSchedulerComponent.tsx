import { appStore } from '@/app';
import { type CheckboxModel, type Nullable, UtcDate, type UtcDateValue } from '@/shared';
import type { DateSelectArg } from '@fullcalendar/core';
import type { EventImpl } from '@fullcalendar/core/internal';
import type FullCalendar from '@fullcalendar/react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type ScheduleAppointmentStatisticsDto, useGetScheduleAppointments } from '../../../../api';
import {
  type GetScheduleAppointmentsQueryParams,
  type Schedule,
  type ScheduleAppointment,
  ScheduleAppointmentStatisticsType,
  type SchedulePerformer,
  SchedulerQueryParams,
  type SchedulerSearchBlockProps,
} from '../../../../shared';
import { StatsFooter } from '../../../SchedulerBoardViewPage/components';
import { VisitsScheduler } from '../VisitsScheduler/VisitsScheduler';
import { VisitsSchedulerToolbar } from '../VisitsSchedulerToolbar/VisitsSchedulerToolbar';
import { VisitsSchedulerComponentStyles } from './VisitsSchedulerComponent.styles';

interface Props {
  schedule: Schedule;
  startDate: UtcDate;
  hiddenStatsTypes: CheckboxModel;
  queryParams: GetScheduleAppointmentsQueryParams;
  searchProps: SchedulerSearchBlockProps;
  statisticsFilter: Nullable<ScheduleAppointmentStatisticsType>;
  areStatisticsLoading: boolean;
  appointmentsStatistics?: ScheduleAppointmentStatisticsDto;
  canAddAppointment?: boolean;
  handleCreateEvent: (args: DateSelectArg) => void;
  handleSelectEvent: (id: number) => void;
  handleUpdateEventDnd: (newEvent: EventImpl) => void;
  setStatisticsFilter: (type: Nullable<ScheduleAppointmentStatisticsType>) => void;
}

// not to ruin memoization when performing nullable coalescing in VisitsScheduler props
const PERFORMERS_EMPTY_ARRAY: SchedulePerformer[] = [];
const APPOINTMENTS_EMPTY_ARRAY: ScheduleAppointment[] = [];

const VisitsSchedulerComponent = observer((props: Props) => {
  const {
    schedule,
    startDate,
    queryParams,
    searchProps,
    hiddenStatsTypes,
    canAddAppointment,
    statisticsFilter,
    appointmentsStatistics,
    areStatisticsLoading,
    handleCreateEvent,
    handleSelectEvent,
    setStatisticsFilter,
    handleUpdateEventDnd,
  } = props;

  const schedulerRef = useRef<FullCalendar>(null);

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!schedulerRef.current) return;

    const schedulerApi = schedulerRef.current.getApi();

    // we need to queueMicrotask because schedulerApi.gotoDate uses flushSync under the hood
    if (startDate) queueMicrotask(() => schedulerApi.gotoDate(startDate.toDate()));
  }, [startDate]);

  const appointmentsQueryEnabled = useMemo<boolean>(
    () => queryParams.scheduleId !== undefined && appStore.isLoaded,
    [queryParams]
  );

  const {
    data: appointmentsResult,
    isLoading,
    isRefetching,
  } = useGetScheduleAppointments({ queryParams, enabled: appointmentsQueryEnabled });

  const handleChangeParams = useCallback(() => {
    if (!schedulerRef.current) return;

    const { view: schedulerViewApi } = schedulerRef.current.getApi();

    setSearchParams(prev => {
      prev.set(
        SchedulerQueryParams.START_DATE,
        UtcDate.fromDate(schedulerViewApi.activeStart).formatISO()
      );
      prev.set(
        SchedulerQueryParams.END_DATE,
        UtcDate.fromDate(schedulerViewApi.activeEnd).formatISO()
      );

      return prev;
    });
  }, [setSearchParams]);

  const getHandleChangeTimePeriodHandler = useCallback(
    (direction: 'prev' | 'next') => () => {
      if (!schedulerRef.current) return;

      const schedulerApi = schedulerRef.current.getApi();

      if (direction === 'prev') schedulerApi.prev();

      if (direction === 'next') schedulerApi.next();

      handleChangeParams();
    },
    [handleChangeParams]
  );

  const handleChangeDate = useCallback(
    (date: UtcDateValue) => {
      if (!schedulerRef.current) return;

      const schedulerApi = schedulerRef.current.getApi();

      if (!date) {
        schedulerApi.gotoDate(UtcDate.startOfCurrentDay().toDate());
      } else {
        schedulerApi.gotoDate(date.toDate());
      }

      handleChangeParams();
    },
    [handleChangeParams]
  );

  const isNoStatisticsShown = useMemo<boolean>(
    () =>
      !Array.from(Object.values(ScheduleAppointmentStatisticsType)).some(
        v => !hiddenStatsTypes.values.includes(v)
      ),
    [hiddenStatsTypes.values]
  );

  return (
    <VisitsSchedulerComponentStyles $noStatistics={isNoStatisticsShown}>
      <VisitsSchedulerToolbar
        searchProps={searchProps}
        startDate={startDate}
        loadingOrRefetching={isLoading || isRefetching}
        handleChangePeriod={handleChangeDate}
        onPrevPeriod={getHandleChangeTimePeriodHandler('prev')}
        onNextPeriod={getHandleChangeTimePeriodHandler('next')}
      />

      <VisitsScheduler
        ref={schedulerRef}
        canAddAppointment={canAddAppointment}
        productsSectionId={schedule.productsSectionId}
        performers={schedule.performers ?? PERFORMERS_EMPTY_ARRAY}
        appointments={appointmentsResult?.appointments ?? APPOINTMENTS_EMPTY_ARRAY}
        handleCreateEvent={handleCreateEvent}
        handleSelectEvent={handleSelectEvent}
        handleUpdateEventDnd={handleUpdateEventDnd}
      />

      <StatsFooter
        isLoading={areStatisticsLoading}
        selectedFilter={statisticsFilter}
        statistics={appointmentsStatistics}
        hiddenStatsTypes={hiddenStatsTypes.values}
        onSelectFilter={setStatisticsFilter}
      />
    </VisitsSchedulerComponentStyles>
  );
});

VisitsSchedulerComponent.displayName = 'VisitsSchedulerComponent';
export { VisitsSchedulerComponent };
