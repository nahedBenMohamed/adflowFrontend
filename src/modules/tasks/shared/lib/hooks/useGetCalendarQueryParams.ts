import type { CalendarView, Nullable, UtcDateValue } from '@/shared';
import { useMemo } from 'react';
import type { TaskBoardFilterDto, TasksForCalendarQueryParamsDto } from '../../../api';
import { calculateEndDate, calculateStartDate } from '../helpers';

export const useGetCalendarQueryParams = ({
  boardId,
  startDate,
  filterDto,
  calendarView,
}: {
  boardId: Nullable<number>;
  startDate: UtcDateValue;
  filterDto: TaskBoardFilterDto;
  calendarView?: CalendarView;
}): TasksForCalendarQueryParamsDto =>
  useMemo<TasksForCalendarQueryParamsDto>(() => {
    const calculatedStartDate = calculateStartDate(startDate, calendarView)?.formatISO();
    const calculatedEndDate = calculateEndDate(startDate, calendarView)?.formatISO();

    return {
      boardId,
      filter: filterDto,
      endDate: calculatedEndDate,
      startDate: calculatedStartDate,
    };
  }, [boardId, calendarView, filterDto, startDate]);
