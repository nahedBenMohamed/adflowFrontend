import { SettingsStore, appStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  CheckboxModel,
  InputModel,
  PageTemplateWithSubheader,
  PermissionObjectType,
  SectionView,
  SelectModel,
  UtcDate,
  WholePageLoaderWithLogo,
  debounce,
  useMobile,
  useTitle,
  useTypedParams,
  type Nullable,
  type Optional,
  type TabModel,
  type UtcDateValue,
} from '@/shared';
import { Tabs } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetScheduleAppointments, useGetScheduleAppointmentsStatistics } from '../../api';
import {
  APPOINTMENT_CARD_LIST_TAB_PREFIX,
  AddAppointmentModal,
  ScheduleAppointmentStatisticsType,
  ScheduleAppointmentStatus,
  SchedulerQueryParams,
  SchedulerStatsSettingsDrawer,
  generateAppointmentCardListTab,
  useGetBoardSchedulerBusinessHours,
  useSchedulerStatisticsFilter,
  type AddAppointmentPreset,
  type CreateBoardAppointmentHandler,
  type GetScheduleAppointmentsQueryParams,
  type GetScheduleAppointmentsStatisticsQueryParams,
  type Schedule,
  type SchedulerSearchBlockProps,
  type SchedulersBoardViewSettings,
} from '../../shared';
import { AppointmentCardListPage } from '../AppointmentCardListPage/AppointmentCardListPage';
import { SchedulerSettingsButton } from '../SchedulerPage/components';
import {
  SchedulerBoardComponent,
  SchedulerBoardHeader,
  SchedulerBoardSecondaryHeader,
  StatsFooter,
} from './components';

const Root = styled.div`
  padding-top: calc(var(--header-height) + 8px);
`;

const { settings: settingsFromLS } =
  SettingsStore.getSettingsStore<SchedulersBoardViewSettings>('SchedulersBoardView');

if (!settingsFromLS.schedules) settingsFromLS.schedules = [];

interface Props {
  startDate: UtcDateValue;
  endDate: UtcDateValue;
  scheduleId: number;
  ReportsTab: ReactNode;
  entitiesTabs: TabModel[];
  isScheduleLoading: boolean;
  isReportOpen: boolean;
  schedule?: Schedule;
  showReportsSettingsDrawer: () => void;
}

const SchedulerBoardViewPage = observer((props: Props) => {
  const {
    startDate,
    endDate,
    scheduleId,
    ReportsTab,
    schedule,
    isScheduleLoading,
    isReportOpen,
    entitiesTabs,
    showReportsSettingsDrawer,
  } = props;

  const savedSettings = settingsFromLS.schedules.find(s => s.scheduleId === scheduleId);

  useTitle({ dynamicTitle: schedule?.name });

  const isMobile = useMobile();

  const { tab } = useTypedParams<{ tab: SectionView.OVERVIEW | SectionView.REPORTS | string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [appointmentModalOpened, { open: showAppointmentModal, close: hideAppointmentModal }] =
    useDisclosure(false);

  const [statsSettingsOpened, { toggle: toggleStatsSettings, close: closeStatsSettings }] =
    useDisclosure(false);

  const [statisticsFilter, setStatisticsFilter] = useSchedulerStatisticsFilter(scheduleId);

  const appointmentIdFromParams = searchParams.get('appointmentId');
  const currentAppointmentId = appointmentIdFromParams ? Number(appointmentIdFromParams) : null;

  useEffect(() => {
    if (currentAppointmentId) showAppointmentModal();
  }, [currentAppointmentId, showAppointmentModal]);

  const [searchQuery, setSearchQuery] = useState<string>();
  const searchModel = useLocalObservable(() => InputModel.create(), []);

  const performerObjectId = useLocalObservable(
    () => SelectModel.create(savedSettings?.performerObjectId),
    []
  );

  const hiddenStatsTypes = useLocalObservable(() =>
    CheckboxModel.createFromOptional(savedSettings?.hiddenStatsTypes)
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
        title: searchQuery,
        scheduleId: schedule?.id,
        endDate: endDate?.formatISO(),
        expand: 'prevAppointmentCount',
        startDate: startDate?.formatISO(),
        performerId:
          schedule && performerObjectId.value
            ? schedule.getPerformerByObjectId(performerObjectId.value)?.id
            : undefined,
      }),
      [endDate, performerObjectId.value, schedule, searchQuery, startDate]
    );

  const appointmentsQueryParamsWithStatisticsFilter = useMemo<GetScheduleAppointmentsQueryParams>(
    () => ({
      ...appointmentsQueryParamsWithoutStatisticsFilter,
      ...statisticsParams,
    }),
    [appointmentsQueryParamsWithoutStatisticsFilter, statisticsParams]
  );

  const isAppointmentsCardListTab = tab.includes(APPOINTMENT_CARD_LIST_TAB_PREFIX);

  const appointmentsQueryEnabled = useMemo<boolean>(
    () =>
      appointmentsQueryParamsWithoutStatisticsFilter.scheduleId !== undefined &&
      appointmentsQueryParamsWithoutStatisticsFilter.performerId !== undefined &&
      appointmentsQueryParamsWithoutStatisticsFilter.startDate !== undefined &&
      appointmentsQueryParamsWithoutStatisticsFilter.endDate !== undefined &&
      appStore.isLoaded &&
      !isAppointmentsCardListTab,
    [appointmentsQueryParamsWithoutStatisticsFilter, isAppointmentsCardListTab]
  );

  const {
    data: appointmentsResult,
    isLoading: areAppointmentsLoading,
    isRefetching: areAppointmentsRefetching,
  } = useGetScheduleAppointments({
    queryParams: appointmentsQueryParamsWithStatisticsFilter,
    enabled: appointmentsQueryEnabled,
  });

  const { data: appointmentsStatistics, isLoading: areStatisticsLoading } =
    useGetScheduleAppointmentsStatistics({
      queryParams: appointmentsQueryParamsWithoutStatisticsFilter,
      enabled: appointmentsQueryEnabled,
    });

  const { businessHours, areBusinessHoursLoading } = useGetBoardSchedulerBusinessHours({
    schedule,
    performerObjectId: performerObjectId.value,
  });

  useDidUpdate(() => {
    if (!performerObjectId.value && schedule)
      performerObjectId.setValue(schedule.perfomersObjectsIds[0]);
  }, [schedule]);

  useEffect(() => {
    if (performerObjectId.value) {
      // in case we changed performers in builder but we have locally saved performer which is
      // not in the list of performers for this schedule anymore
      if (schedule && !schedule.perfomersObjectsIds.includes(performerObjectId.value)) {
        performerObjectId.value = schedule.perfomersObjectsIds[0];
      }

      settingsFromLS.schedules = [
        ...settingsFromLS.schedules.filter(s => s.scheduleId !== scheduleId),
        {
          scheduleId,
          performerObjectId: performerObjectId.value,
          hiddenStatsTypes: hiddenStatsTypes.values,
        },
      ];
    }
  }, [performerObjectId, schedule, performerObjectId.value, scheduleId, hiddenStatsTypes.values]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchQuery = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim().length) {
        setSearchQuery(undefined);

        return;
      }

      setSearchQuery(searchQuery);
    }, 750),
    []
  );

  const handleClearSearchQuery = useCallback(() => {
    searchModel.value = '';

    setSearchQuery(undefined);
  }, [searchModel]);

  const statsSettingsProps = useMemo(
    () => ({
      opened: statsSettingsOpened,
      toggle: toggleStatsSettings,
    }),
    [statsSettingsOpened, toggleStatsSettings]
  );

  const [appointmentPreset, setAppointmentPreset] = useState<Nullable<AddAppointmentPreset>>(null);

  const handleSelectCell = useCallback<CreateBoardAppointmentHandler>(
    ({ startDate, endDate }) => {
      if (!schedule) {
        throw new Error(
          `Failed to identify schedule for date ${startDate.formatISO()} while creating appointment, you can not create appointment unless schedule is loaded.`
        );
      }

      setAppointmentPreset({
        endDate,
        startDate,
        performerObjectId: performerObjectId.value,
      });

      showAppointmentModal();
    },
    [schedule, performerObjectId.value, showAppointmentModal]
  );

  const handleEditCell = useCallback(
    (appointmentId: number) => {
      setSearchParams(prev => {
        prev.set(SchedulerQueryParams.APPOINTMENT_ID, String(appointmentId));

        return prev;
      });
    },
    [setSearchParams]
  );

  const handleShowAppointmentModal = useCallback(() => {
    setAppointmentPreset({
      performerObjectId: performerObjectId.value,
      startDate: UtcDate.parseISO(searchParams.get(SchedulerQueryParams.START_DATE)),
      endDate: UtcDate.parseISO(searchParams.get(SchedulerQueryParams.END_DATE)),
    });

    showAppointmentModal();
  }, [performerObjectId.value, searchParams, showAppointmentModal]);

  const handleCloseAppointmentModal = useCallback(() => {
    setAppointmentPreset(null);

    setSearchParams(prev => {
      prev.delete(SchedulerQueryParams.APPOINTMENT_ID);

      return prev;
    });

    hideAppointmentModal();
  }, [setSearchParams, hideAppointmentModal]);

  const getHandleChangeTimePeriodHandler = useCallback(
    (direction: 'prev' | 'next') => () => {
      if (!startDate)
        throw new Error(`Failed to change time period, startDate ${startDate} is not defined`);

      if (direction === 'prev') {
        const previousDay = startDate.subtractDays(1);

        setSearchParams(prev => {
          prev.set(SchedulerQueryParams.START_DATE, previousDay.startOfDay().formatISO());
          prev.set(SchedulerQueryParams.END_DATE, previousDay.endOfDay().formatISO());

          return prev;
        });
      }

      if (direction === 'next') {
        const nextDay = startDate.addDays(1);

        setSearchParams(prev => {
          prev.set(SchedulerQueryParams.START_DATE, nextDay.startOfDay().formatISO());
          prev.set(SchedulerQueryParams.END_DATE, nextDay.endOfDay().formatISO());

          return prev;
        });
      }
    },
    [startDate, setSearchParams]
  );

  const handleChangeDate = useCallback(
    (date: UtcDateValue) => {
      if (!date) throw new Error(`Failed to change date, date ${date} is not defined.`);

      setSearchParams(prev => {
        prev.set(SchedulerQueryParams.START_DATE, date.startOfDay().formatISO());
        prev.set(SchedulerQueryParams.END_DATE, date.endOfDay().formatISO());

        return prev;
      });
    },
    [setSearchParams]
  );

  const searchProps = useMemo<SchedulerSearchBlockProps>(
    () => ({
      searchModel,
      onChange: debouncedSearchQuery,
      onClear: handleClearSearchQuery,
    }),
    [searchModel, debouncedSearchQuery, handleClearSearchQuery]
  );

  const isNoStatisticsShown = useMemo<boolean>(
    () =>
      !Array.from(Object.values(ScheduleAppointmentStatisticsType)).some(
        v => !hiddenStatsTypes.values.includes(v)
      ),
    [hiddenStatsTypes.values]
  );

  if (!appStore.isLoaded) return <WholePageLoaderWithLogo />;

  const { user: currentUser } = authStore;
  const canAddAppointment = isReportOpen
    ? false
    : currentUser?.canCreate(PermissionObjectType.SCHEDULE, schedule?.id);

  const linkedEntityTypeId = schedule?.entityTypeId;

  return (
    <PageTemplateWithSubheader
      tabs={entitiesTabs}
      pageMinWidth={isMobile ? 0 : undefined}
      rootWidth={isAppointmentsCardListTab ? undefined : '100%'}
      SubheaderControls={
        <SchedulerSettingsButton
          scheduleId={scheduleId}
          showReportsSettingsDrawer={isReportOpen ? showReportsSettingsDrawer : undefined}
          statsSettingsProps={statsSettingsProps}
        />
      }
      Header={
        <SchedulerBoardHeader
          schedule={schedule}
          canAddAppointment={canAddAppointment}
          performerObjectId={performerObjectId}
          isScheduleLoading={isScheduleLoading}
          showAppointmentModal={handleShowAppointmentModal}
        />
      }
    >
      <Tabs.Panel value={SectionView.OVERVIEW}>
        {isScheduleLoading ? (
          <WholePageLoaderWithLogo ensureSubheaderWithOffset extraOffset="16px" />
        ) : (
          <>
            <Root>
              {startDate && (
                <>
                  <SchedulerBoardSecondaryHeader
                    startDate={startDate}
                    searchProps={searchProps}
                    loadingOrRefetching={areAppointmentsLoading || areAppointmentsRefetching}
                    handleChangePeriod={handleChangeDate}
                    onNextPeriod={getHandleChangeTimePeriodHandler('next')}
                    onPrevPeriod={getHandleChangeTimePeriodHandler('prev')}
                  />

                  {schedule && (
                    <SchedulerBoardComponent
                      schedule={schedule}
                      startDate={startDate}
                      businessHours={businessHours}
                      isLoading={areAppointmentsLoading || areBusinessHoursLoading}
                      canAddAppointment={canAddAppointment}
                      appointmentsResult={appointmentsResult}
                      isNoStatisticsShown={isNoStatisticsShown}
                      productsSectionId={schedule.productsSectionId}
                      appointmentsQueryParams={appointmentsQueryParamsWithStatisticsFilter}
                      handleEditCell={handleEditCell}
                      handleCreateAppointment={handleSelectCell}
                    />
                  )}
                </>
              )}
            </Root>

            <StatsFooter
              statistics={appointmentsStatistics}
              hiddenStatsTypes={hiddenStatsTypes.values}
              selectedFilter={statisticsFilter}
              onSelectFilter={setStatisticsFilter}
              isLoading={areStatisticsLoading}
            />
          </>
        )}

        <SchedulerStatsSettingsDrawer
          opened={statsSettingsOpened}
          hiddenStatsTypes={hiddenStatsTypes}
          hide={closeStatsSettings}
        />

        {schedule && appointmentModalOpened && (
          <AddAppointmentModal
            schedule={schedule}
            preset={appointmentPreset}
            opened={appointmentModalOpened}
            queryParams={appointmentsQueryParamsWithStatisticsFilter}
            currentAppointmentId={currentAppointmentId}
            onClose={handleCloseAppointmentModal}
          />
        )}
      </Tabs.Panel>

      <Tabs.Panel value={SectionView.REPORTS}>{ReportsTab}</Tabs.Panel>

      {linkedEntityTypeId && (
        <Tabs.Panel value={generateAppointmentCardListTab(linkedEntityTypeId)}>
          <AppointmentCardListPage
            endDate={endDate}
            startDate={startDate}
            scheduleId={scheduleId}
            hiddenStatsTypes={hiddenStatsTypes}
            linkedEntityTypeId={linkedEntityTypeId}
          />

          <SchedulerStatsSettingsDrawer
            opened={statsSettingsOpened}
            hiddenStatsTypes={hiddenStatsTypes}
            hide={closeStatsSettings}
          />
        </Tabs.Panel>
      )}
    </PageTemplateWithSubheader>
  );
});

SchedulerBoardViewPage.displayName = 'SchedulerBoardViewPage';
export { SchedulerBoardViewPage };
