import { appStore, entityTypeStore, SettingsStore } from '@/app';
import {
  EntitiesListSettingsStore,
  SectionTable,
  type SectionTableStyles,
} from '@/modules/section';
import {
  CommonQueryParams,
  debounce,
  MyDatePickerSelect,
  PageSecondaryHeader,
  SelectModel,
  UriCodingUtil,
  useToggleControl,
  type CheckboxModel,
  type Nullable,
  type Optional,
  type SectionPaginationProps,
  type UtcDatesRangeValue,
  type UtcDateValue,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetScheduleAppointmentsStatistics } from '../../api';
import {
  ScheduleAppointmentStatisticsType,
  ScheduleAppointmentStatus,
  SchedulerQueryParams,
  useSchedulerStatisticsFilter,
  type GetScheduleAppointmentsQueryParams,
  type GetScheduleAppointmentsStatisticsQueryParams,
  type SchedulerCardListSettings,
} from '../../shared';
import { AppointmentCardListPageStore } from '../../store';
import { StatsFooter } from '../SchedulerBoardViewPage/components';

const Root = styled.div`
  position: relative;

  padding: var(--header-height) 0 calc(var(--scheduler-statistics-height) + 16px);
`;

interface Props {
  scheduleId: number;
  endDate: UtcDateValue;
  startDate: UtcDateValue;
  linkedEntityTypeId: number;
  hiddenStatsTypes: CheckboxModel;
}

const SCHEDULER_CARD_LIST_SETTINGS_KEY = 'SchedulerCardListSettings';

const { settings } = SettingsStore.getSettingsStore<{ periods: SchedulerCardListSettings[] }>(
  SCHEDULER_CARD_LIST_SETTINGS_KEY
);

if (!settings.periods) {
  settings.periods = [];
}

const EMPTY_FILTER = {};
const sectionTableStyles: SectionTableStyles = {
  loader: {
    extraOffset: 'calc(var(--header-height) + var(--scheduler-statistics-height) + 16px)',
  },
  headRow: {
    top: 'calc(var(--header-with-subheader-height) + var(--header-height))',
  },
};

const AppointmentCardListPage = observer((props: Props) => {
  const { scheduleId, endDate, startDate, linkedEntityTypeId, hiddenStatsTypes } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.appointment_card_list_page',
  });

  const [tableKey, forceTableRerender] = useReducer(x => ++x, 0);

  const [searchParams, setSearchParams] = useSearchParams();

  let pageFromParams = searchParams.get(CommonQueryParams.PAGE);
  let currentPage = pageFromParams ? Number(pageFromParams) : 1;

  const { pathname, search } = useLocation();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const [settingsOpened, { close: closeSettings }] = useDisclosure(false);

  const appointmentCardListPageStore = useMemo(
    () => new AppointmentCardListPageStore({ scheduleId, entityTypeId: linkedEntityTypeId }),
    [scheduleId, linkedEntityTypeId]
  );

  const {
    entities,
    isLoaded,
    pageCount,
    meta: { totalCount },
    changeName,
    changeStage,
    changeFieldValue,
    changeResponsible,
    showMutationWarning,
    loadData: loadAppointmentCardListPageStoreData,
  } = appointmentCardListPageStore;

  useEffect(() => {
    setSearchParams(prev => {
      prev.set(CommonQueryParams.PAGE, String(currentPage));

      return prev;
    });
  }, [currentPage, setSearchParams]);

  const handleChangePage = useCallback(
    (page: number) => {
      setSearchParams(prev => {
        prev.set(CommonQueryParams.PAGE, String(page));

        return prev;
      });
    },
    [setSearchParams]
  );

  const paginationProps = useMemo<SectionPaginationProps>(
    () => ({
      pageCount,
      currentPage,
      handleChange: handleChangePage,
    }),
    [currentPage, pageCount, handleChangePage]
  );

  const entityType = entityTypeStore.getById(linkedEntityTypeId);

  const entitiesListSettingsStore = useMemo(
    () =>
      new EntitiesListSettingsStore({
        boardId: null,
        entityTypeId: linkedEntityTypeId,
      }),
    [linkedEntityTypeId]
  );

  useEffect(() => {
    entitiesListSettingsStore.loadData();
  }, [entitiesListSettingsStore]);

  const [statisticsFilter, setStatisticsFilter] = useSchedulerStatisticsFilter(scheduleId);

  const handleSelectFilter = useCallback(
    (value: Nullable<ScheduleAppointmentStatisticsType>) => {
      setStatisticsFilter(value);

      setSearchParams(prev => {
        prev.set(CommonQueryParams.PAGE, String(1));

        return prev;
      });
    },
    [setSearchParams, setStatisticsFilter]
  );

  const statusByStatisticsFilter = useMemo<Optional<ScheduleAppointmentStatus>>(() => {
    switch (statisticsFilter) {
      case ScheduleAppointmentStatisticsType.ASSIGNED:
        return ScheduleAppointmentStatus.NOT_CONFIRMED;

      case ScheduleAppointmentStatisticsType.CONFIRMED:
        return ScheduleAppointmentStatus.CONFIRMED;

      case ScheduleAppointmentStatisticsType.COMPLETED:
        return ScheduleAppointmentStatus.COMPLETED;

      default:
        return;
    }
  }, [statisticsFilter]);

  const statisticsParams = useMemo<GetScheduleAppointmentsStatisticsQueryParams>(
    () => ({
      status: statusByStatisticsFilter,
      isNewbie: statisticsFilter === ScheduleAppointmentStatisticsType.NEWBIES || undefined,
      isNotScheduled:
        statisticsFilter === ScheduleAppointmentStatisticsType.NOT_SCHEDULED || undefined,
      isNotTookPlace:
        statisticsFilter === ScheduleAppointmentStatisticsType.NOT_TOOK_PLACE || undefined,
    }),
    [statusByStatisticsFilter, statisticsFilter]
  );

  const appointmentsQueryParamsWithoutStatisticsFilter =
    useMemo<GetScheduleAppointmentsQueryParams>(
      () => ({
        scheduleId,
        endDate: endDate?.formatISO(),
        startDate: startDate?.formatISO(),
      }),
      [scheduleId, endDate, startDate]
    );

  const appointmentsQueryParamsWithStatisticsFilter = useMemo<GetScheduleAppointmentsQueryParams>(
    () => ({
      ...appointmentsQueryParamsWithoutStatisticsFilter,
      ...statisticsParams,
    }),
    [appointmentsQueryParamsWithoutStatisticsFilter, statisticsParams]
  );

  const previousLoadDataArgsRef = useRef<Nullable<object>>(null);

  const handleLoadData = useCallback(() => {
    const currentArgs = {
      page: currentPage,
      params: appointmentsQueryParamsWithStatisticsFilter,
    };

    if (JSON.stringify(previousLoadDataArgsRef.current) === JSON.stringify(currentArgs))
      // skipping loadData since arguments have not changed
      // a lot of renders happening here so we need to implement this logic
      // TODO: Refactor and investigate why, find a more straightforward solution
      return;

    loadAppointmentCardListPageStoreData(currentArgs);

    previousLoadDataArgsRef.current = currentArgs;
  }, [
    currentPage,
    appointmentsQueryParamsWithStatisticsFilter,
    loadAppointmentCardListPageStoreData,
  ]);

  useLayoutEffect(() => {
    handleLoadData();
    // loadData should be triggered once on component mount or boardId change to load initial data,
    // handlePageChange will trigger loadData on page change, filter changes will also trigger it's own loadData
  }, [handleLoadData]);

  const appointmentsQueryEnabled = useMemo<boolean>(
    () =>
      appointmentsQueryParamsWithoutStatisticsFilter.scheduleId !== undefined && appStore.isLoaded,
    [appointmentsQueryParamsWithoutStatisticsFilter]
  );

  const { data: appointmentsStatistics, isLoading: areStatisticsLoading } =
    useGetScheduleAppointmentsStatistics({
      refetchOnWindowFocus: false,
      enabled: appointmentsQueryEnabled,
      queryParams: appointmentsQueryParamsWithoutStatisticsFilter,
    });

  const savedPeriod = useMemo<Optional<UtcDatesRangeValue>>(() => {
    const period = settings.periods?.find(
      p => p.scheduleId === scheduleId && p.linkedEntityTypeId === linkedEntityTypeId
    );

    if (period) return [period.startDate, period.endDate];
  }, [scheduleId, linkedEntityTypeId]);

  const periodForModel = useMemo<UtcDatesRangeValue>(
    () => savedPeriod ?? ([startDate, endDate] as UtcDatesRangeValue),
    [endDate, savedPeriod, startDate]
  );

  const periodControl = useToggleControl(false);
  const periodModel = useLocalObservable(() => SelectModel.create(periodForModel));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleChangePeriod = useCallback(
    debounce((period: UtcDatesRangeValue) => {
      if (!period) throw new Error(`Failed to change period, period is not defined: ${period}`);

      const [startDate, endDate] = period;

      setSearchParams(prev => {
        prev.set(CommonQueryParams.PAGE, String(1));

        if (startDate) {
          prev.set(SchedulerQueryParams.START_DATE, startDate.formatISO());
        } else {
          prev.delete(SchedulerQueryParams.START_DATE);
        }

        if (endDate) {
          prev.set(SchedulerQueryParams.END_DATE, endDate.formatISO());
        } else {
          prev.delete(SchedulerQueryParams.END_DATE);
        }

        return prev;
      });

      if (!startDate && !endDate && savedPeriod) {
        settings.periods = settings.periods?.filter(
          p => !(p.scheduleId === scheduleId && p.linkedEntityTypeId === linkedEntityTypeId)
        );
      } else if (startDate && endDate && savedPeriod) {
        settings.periods = settings.periods?.filter(
          p => !(p.scheduleId === scheduleId && p.linkedEntityTypeId === linkedEntityTypeId)
        );

        settings.periods.push({ scheduleId, linkedEntityTypeId, startDate, endDate });
      } else if (startDate && endDate && !savedPeriod) {
        settings.periods.push({ scheduleId, linkedEntityTypeId, startDate, endDate });
      }
    }, 1000),
    [setSearchParams]
  );

  return (
    <Root>
      <PageSecondaryHeader pageHasSubheader>
        <MyDatePickerSelect
          clearable
          type="range"
          titleWidth="300px"
          model={periodModel}
          opened={periodControl.active}
          placeholder={t('visit_date')}
          variant="outlined-without-active-shadow"
          show={periodControl.open}
          hide={periodControl.close}
          handleChange={debouncedHandleChangePeriod}
        />
      </PageSecondaryHeader>

      <SectionTable
        key={tableKey}
        boardId={null}
        entities={entities}
        isLoaded={isLoaded}
        disableBatchActions
        filter={EMPTY_FILTER}
        totalCount={totalCount}
        entityType={entityType}
        settingsOpened={settingsOpened}
        paginationProps={paginationProps}
        sectionTableStyles={sectionTableStyles}
        currentPageEncodedUrl={currentPageEncodedUrl}
        entitiesListSettingsStore={entitiesListSettingsStore}
        reload={handleLoadData}
        closeSettings={closeSettings}
        handleChangeName={changeName}
        handleChangeStage={changeStage}
        forceRerender={forceTableRerender}
        handleChangeFieldValue={changeFieldValue}
        showMutationWarning={showMutationWarning}
        handleChangeResponsible={changeResponsible}
      />

      <StatsFooter
        isLoading={areStatisticsLoading}
        selectedFilter={statisticsFilter}
        statistics={appointmentsStatistics}
        hiddenStatsTypes={hiddenStatsTypes.values}
        onSelectFilter={handleSelectFilter}
      />
    </Root>
  );
});

AppointmentCardListPage.displayName = 'AppointmentCardListPage';
export { AppointmentCardListPage };
