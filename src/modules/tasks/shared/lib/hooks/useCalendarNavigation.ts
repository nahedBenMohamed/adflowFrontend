import { CalendarView, UtcDate, type Optional, type UtcDateValue } from '@/shared';
import type { CalendarApi } from '@fullcalendar/core';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TaskCalendarRouteGenerator } from '../types';

interface CalendarNavigation {
  handleChangeDate: (date: UtcDateValue) => void;
  handleGoToDay: (date: Date) => void;
  handleChangeNextDate: () => void;
  handleChangePrevDate: () => void;
}

interface Params {
  routeGenerator: TaskCalendarRouteGenerator;
  schedulerApi: Optional<CalendarApi>;
  calendarView: CalendarView;
}

export const useCalendarNavigation = ({
  routeGenerator,
  schedulerApi,
  calendarView,
}: Params): CalendarNavigation => {
  const navigate = useNavigate();

  const handleChangeDate = useCallback(
    (targetDate: UtcDateValue) => {
      if (!schedulerApi || !targetDate) return;

      queueMicrotask(() => {
        schedulerApi.gotoDate(targetDate.toDate());

        const date = UtcDate.fromDate(schedulerApi.getDate());

        navigate(
          routeGenerator({
            view: calendarView,
            year: date.year,
            month: date.canonicalMonth,
            day: date.day,
          }),
          { replace: true }
        );
      });
    },
    [calendarView, navigate, routeGenerator, schedulerApi]
  );

  const handleGoToDay = useCallback(
    (date: Date) => {
      const newDate = UtcDate.fromDate(date);

      navigate(
        routeGenerator({
          view: CalendarView.DAY,
          year: newDate.year,
          month: newDate.canonicalMonth,
          day: newDate.day,
        }),
        { replace: true }
      );
    },
    [navigate, routeGenerator]
  );

  const handleChangeNextDate = useCallback(() => {
    if (!schedulerApi) return;

    queueMicrotask(() => {
      schedulerApi.next();
      const newDate = UtcDate.fromDate(schedulerApi.getDate());

      navigate(
        routeGenerator({
          view: CalendarView.DAY,
          year: newDate.year,
          month: newDate.canonicalMonth,
          day: newDate.day,
        }),
        { replace: true }
      );
    });
  }, [navigate, routeGenerator, schedulerApi]);

  const handleChangePrevDate = useCallback(() => {
    if (!schedulerApi) return;

    queueMicrotask(() => {
      schedulerApi.prev();
      const newDate = UtcDate.fromDate(schedulerApi.getDate());

      navigate(
        routeGenerator({
          view: CalendarView.DAY,
          year: newDate.year,
          month: newDate.canonicalMonth,
          day: newDate.day,
        }),
        { replace: true }
      );
    });
  }, [navigate, routeGenerator, schedulerApi]);

  return { handleChangeDate, handleGoToDay, handleChangeNextDate, handleChangePrevDate };
};
