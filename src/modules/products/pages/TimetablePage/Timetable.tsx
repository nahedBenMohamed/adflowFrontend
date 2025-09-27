import { appStore } from '@/app';
import { SelectModel, UtcDate, type BooleanModel } from '@/shared';
import type { ViewApi } from '@fullcalendar/core';
import { when } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetRentals } from '../../api';
import {
  transformCalendarEvents,
  transformProductsToResources,
  type ProductCategoriesSelectProps,
} from '../../shared';
import { ProductCategoryStore } from '../../store';
import { CalendarComponent } from './components';

const CALENDAR_DATE_FORMAT_STRING = 'YYYY-MM-DD';

interface Props {
  sectionId: number;
  hideEmptyResourcesModel: BooleanModel;
}

const Timetable = observer((props: Props) => {
  const { sectionId, hideEmptyResourcesModel } = props;

  const productCategoryStore = useMemo(() => new ProductCategoryStore(sectionId), [sectionId]);

  const { isLoaded: areCategoriesLoaded, loadData: loadCategories } = productCategoryStore;

  const selectedCategoryId = useLocalObservable(() => SelectModel.create());

  const [startDate, setStartDate] = useState<string>(
    UtcDate.now().format(CALENDAR_DATE_FORMAT_STRING)
  );
  const [endDate, setEndDate] = useState<string>(UtcDate.now().format(CALENDAR_DATE_FORMAT_STRING));

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        loadCategories();
      }
    );
  }, [loadCategories]);

  const { data: rentalsResult, isLoading } = useGetRentals({
    sectionId,
    page: 1,
    queryParams: {
      categoryId: selectedCategoryId.value,
      startDate: UtcDate.fromDate(
        new Date(`${startDate.split('T')[0]}T00:00:00`)
      ).formatISOWithoutUnix(),
      endDate: UtcDate.fromDate(
        new Date(`${endDate.split('T')[0]}T23:59:59`)
      ).formatISOWithoutUnix(),
    },
  });

  const rentals = useMemo(() => rentalsResult?.events ?? [], [rentalsResult?.events]);

  const events = useMemo(
    () => transformCalendarEvents(rentalsResult?.events ?? []),
    [rentalsResult?.events]
  );

  const resources = useMemo(
    () => transformProductsToResources(rentalsResult?.products ?? []),
    [rentalsResult?.products]
  );

  const initializeDates = useCallback((calendarViewApi: ViewApi) => {
    setStartDate(calendarViewApi.activeStart.toISOString());
    setEndDate(calendarViewApi.activeEnd.toISOString());
  }, []);

  const categoriesSelectProps = useMemo<ProductCategoriesSelectProps>(
    () => ({
      titleWidth: '240px',
      productCategoryStore,
      model: selectedCategoryId,
      disabled: !areCategoriesLoaded,
    }),
    [selectedCategoryId, productCategoryStore, areCategoriesLoaded]
  );

  return (
    <CalendarComponent
      events={events}
      rentals={rentals}
      isLoading={isLoading}
      sectionId={sectionId}
      resources={resources}
      categoriesSelectProps={categoriesSelectProps}
      hideEmptyResourcesModel={hideEmptyResourcesModel}
      initializeDates={initializeDates}
    />
  );
});

Timetable.displayName = 'Timetable';
export { Timetable };
