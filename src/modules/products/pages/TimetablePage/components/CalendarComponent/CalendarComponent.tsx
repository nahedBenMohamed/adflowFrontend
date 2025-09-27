import {
  CalendarView,
  Nullable,
  UtcDate,
  WholePageLoaderWithLogo,
  type BooleanModel,
} from '@/shared';
import type { CalendarApi, ViewApi } from '@fullcalendar/core';
import type FullCalendar from '@fullcalendar/react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGetProductsSection } from '../../../../api';
import {
  ResourceViewMode,
  type CalendarEvent,
  type CalendarResource,
  type ProductCategoriesSelectProps,
  type Rental,
} from '../../../../shared';
import { Calendar } from '../Calendar/Calendar';
import { CalendarToolbar } from '../CalendarToolbar/CalendarToolbar';
import { CalendarComponentStyles } from './CalendarComponent.styles';

interface Props {
  sectionId: number;
  rentals: Rental[];
  events: CalendarEvent[];
  resources: CalendarResource[];
  hideEmptyResourcesModel: BooleanModel;
  categoriesSelectProps: ProductCategoriesSelectProps;
  isLoading?: boolean;
  initializeDates: (calendarViewApi: ViewApi) => void;
  handleCreateEvent?: () => void;
  handleDeleteEvent?: () => void;
}

let calendarApi: CalendarApi;

const CalendarComponent = (props: Props) => {
  const {
    sectionId,
    rentals,
    events,
    resources,
    isLoading,
    hideEmptyResourcesModel,
    categoriesSelectProps,
    initializeDates,
  } = props;

  const calendarRef = useRef<FullCalendar>(null);

  const [calendarPeriodTitle, setCalendarPeriodTitle] = useState('');
  const [resourceViewMode, setResourceViewMode] = useState<ResourceViewMode>(ResourceViewMode.ROW);
  const [currentGridPeriod, setCurrentGridPeriod] = useState<Nullable<string>>(CalendarView.WEEK);

  const { data: productSection } = useGetProductsSection(sectionId);

  const handleChangePage = useCallback(
    (direction: 'prev' | 'next') => {
      const { view: calendarViewApi } = calendarApi;

      if (direction === 'prev') calendarApi.prev();

      if (direction === 'next') calendarApi.next();

      initializeDates(calendarViewApi);
      setCalendarPeriodTitle(calendarViewApi.title);
    },
    [initializeDates]
  );

  useEffect(() => {
    // scroll to current day if current month is selected
    queueMicrotask(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();

        const currentDay = UtcDate.now().day;
        const currentMonth = UtcDate.now().month;
        const calendarMonth = calendarApi?.getDate().getMonth();

        if (currentMonth === calendarMonth) {
          calendarRef.current.getApi().scrollToTime({
            day: currentDay > 1 ? currentDay - 1 : currentDay,
          });
        }
      }
    });
  }, [currentGridPeriod]);

  useLayoutEffect(() => {
    if (!isLoading && calendarRef.current) {
      calendarApi = calendarRef.current.getApi();

      const { view: calendarViewApi } = calendarApi;

      initializeDates(calendarViewApi);

      setCalendarPeriodTitle(calendarViewApi.title);
    }
  }, [calendarRef, isLoading, initializeDates]);

  if (isLoading) return <WholePageLoaderWithLogo ensureSubheaderWithOffset />;

  return (
    <CalendarComponentStyles>
      <CalendarToolbar
        title={calendarPeriodTitle}
        resourceViewMode={resourceViewMode}
        categorySelectProps={categoriesSelectProps}
        onChangeGridPeriod={setCurrentGridPeriod}
        handleChangeResourceViewMode={setResourceViewMode}
        onPrev={() => handleChangePage('prev')}
        onNext={() => handleChangePage('next')}
      />

      <Calendar
        ref={calendarRef}
        events={events}
        rentals={rentals}
        resources={resources}
        calendarApi={calendarApi}
        productsSection={productSection}
        resourceViewMode={resourceViewMode}
        currentGridPeriod={currentGridPeriod as CalendarView}
        hideEmptyResourcesModel={hideEmptyResourcesModel}
        setCalendarPeriodTitle={setCalendarPeriodTitle}
        initializeDates={initializeDates}
      />
    </CalendarComponentStyles>
  );
};

export { CalendarComponent };
