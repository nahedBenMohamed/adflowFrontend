import { SettingsStore, appStore, iconStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  AddRoundButton,
  CheckboxModel,
  DefaultHeader,
  InputModel,
  PageTemplateWithSubheader,
  PermissionObjectType,
  SectionView,
  TutorialProductType,
  UtcDate,
  WholePageLoaderWithLogo,
  debounce,
  useMobile,
  useTitle,
  useTypedParams,
  type DefaultHeaderModuleIconProps,
  type Nullable,
  type Optional,
  type TabModel,
  type UtcDateValue,
} from '@/shared';
import type { DateSelectArg } from '@fullcalendar/core';
import type { EventImpl } from '@fullcalendar/core/internal';
import { Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  UpdateScheduleAppointmentDto,
  scheduleAppointmentApi,
  updateScheduleAppointmentInCache,
  useGetScheduleAppointmentsStatistics,
} from '../../api';
import {
  APPOINTMENT_CARD_LIST_TAB_PREFIX,
  AddAppointmentModal,
  ScheduleAppointmentStatisticsType,
  ScheduleAppointmentStatus,
  SchedulerQueryParams,
  SchedulerStatsSettingsDrawer,
  generateAppointmentCardListTab,
  useSchedulerStatisticsFilter,
  type AddAppointmentPreset,
  type GetScheduleAppointmentsQueryParams,
  type GetScheduleAppointmentsStatisticsQueryParams,
  type Schedule,
  type ScheduleAppointment,
  type SchedulerScheduleViewSettings,
  type SchedulerSearchBlockProps,
} from '../../shared';
import { AppointmentCardListPage } from '../AppointmentCardListPage/AppointmentCardListPage';
import { SchedulerSettingsButton } from '../SchedulerPage/components';
import { VisitsSchedulerComponent } from './components';

const { settings: settingsFromLS } =
  SettingsStore.getSettingsStore<SchedulerScheduleViewSettings>('SchedulerScheduleView');

if (!settingsFromLS.schedules) settingsFromLS.schedules = [];

interface Props {
  scheduleId: number;
  startDate: UtcDateValue;
  endDate: UtcDateValue;
  ReportsTab: ReactNode;
  entitiesTabs: TabModel[];
  isScheduleLoading: boolean;
  isReportOpen: boolean;
  schedule?: Schedule;
  showReportsSettingsDrawer: () => void;
}

const SchedulerScheduleViewPage = observer((props: Props) => {
  const {
    scheduleId,
    startDate,
    endDate,
    ReportsTab,
    isScheduleLoading,
    entitiesTabs,
    isReportOpen,
    schedule,
    showReportsSettingsDrawer,
  } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page',
  });

  const savedSettings = settingsFromLS.schedules.find(s => s.scheduleId === scheduleId);

  const [appointmentModalOpened, { open: showAppointmentModal, close: hideAppointmentModal }] =
    useDisclosure(false);

  const { tab } = useTypedParams<{ tab: SectionView.OVERVIEW | SectionView.REPORTS | string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const appointmentIdFromParams = searchParams.get('appointmentId');
  const currentAppointmentId = appointmentIdFromParams ? Number(appointmentIdFromParams) : null;

  useEffect(() => {
    if (currentAppointmentId) showAppointmentModal();
  }, [currentAppointmentId, showAppointmentModal]);

  useTitle({ dynamicTitle: schedule?.name });

  const isMobile = useMobile();

  const [appointmentPreset, setAppointmentPreset] = useState<Nullable<AddAppointmentPreset>>(null);

  const [statisticsFilter, setStatisticsFilter] = useSchedulerStatisticsFilter(scheduleId);

  const [statsSettingsOpened, { toggle: toggleStatsSettings, close: closeStatsSettings }] =
    useDisclosure(false);

  const hiddenStatsTypes = useLocalObservable(() =>
    CheckboxModel.createFromOptional(savedSettings?.hiddenStatsTypes)
  );

  const handleSelectCell = useCallback(
    (args: DateSelectArg) => {
      const { start, end, resource } = args;

      if (!schedule)
        throw new Error(
          `Failed to identify schedule for date ${start.toISOString()} while creating appointment, you can not create appointment unless schedule is loaded.`
        );

      setAppointmentPreset({
        performerObjectId: resource
          ? (schedule.getObjectIdByPerformerId(Number(resource.id)) ?? undefined)
          : undefined,
        startDate: UtcDate.fromDate(start),
        endDate: UtcDate.fromDate(end),
      });

      showAppointmentModal();
    },
    [showAppointmentModal, schedule]
  );

  const handleSelectEvent = useCallback(
    (appointmentId: number) => {
      setSearchParams(prev => {
        prev.set(SchedulerQueryParams.APPOINTMENT_ID, String(appointmentId));

        return prev;
      });
    },
    [setSearchParams]
  );

  const handleUpdateEventDnd = useCallback(async (newEvent: EventImpl): Promise<void> => {
    const appointment: ScheduleAppointment = newEvent.extendedProps.appointment;

    const newStartDate = UtcDate.fromNullableDate(newEvent.start);
    const newEndDate = UtcDate.fromNullableDate(newEvent.end);
    const newEventResourceId = newEvent.getResources()[0]?.id;

    if (!newEventResourceId || !newEndDate || !newStartDate) {
      throw new Error(
        `Failed to identify resource, startDate or endDate for event ${
          newEvent.title
        } while updating, instead received: ${JSON.stringify({
          resource: newEventResourceId,
          startDate: newStartDate,
          endDate: newEndDate,
        })}`
      );
    }

    const dto = UpdateScheduleAppointmentDto.fromModel(appointment);

    dto.performerId = Number(newEventResourceId);
    dto.startDate = newStartDate.formatISO();
    dto.endDate = newEndDate.formatISO();

    const updatedAppointment = await scheduleAppointmentApi.updateScheduleAppointment({
      appointmentId: appointment.id,
      dto,
    });
    updateScheduleAppointmentInCache(updatedAppointment);
  }, []);

  const handleShowAppointmentModal = useCallback(() => {
    setAppointmentPreset({
      startDate: UtcDate.parseISO(searchParams.get(SchedulerQueryParams.START_DATE)),
      endDate: UtcDate.parseISO(searchParams.get(SchedulerQueryParams.END_DATE)),
    });

    showAppointmentModal();
  }, [searchParams, showAppointmentModal]);

  const handleCloseModal = useCallback(() => {
    setAppointmentPreset(null);

    setSearchParams(prev => {
      prev.delete(SchedulerQueryParams.APPOINTMENT_ID);

      return prev;
    });

    hideAppointmentModal();
  }, [setSearchParams, hideAppointmentModal]);

  const [searchQuery, setSearchQuery] = useState<string>();
  const searchModel = useLocalObservable(() => InputModel.create(), []);

  useEffect(() => {
    settingsFromLS.schedules = [
      ...settingsFromLS.schedules.filter(s => s.scheduleId !== scheduleId),
      {
        scheduleId,
        hiddenStatsTypes: hiddenStatsTypes.values,
      },
    ];
  }, [hiddenStatsTypes.values, scheduleId]);

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
        expand: 'prevAppointmentCount',
        startDate: startDate?.formatISO(),
        endDate: endDate?.formatISO(),
      }),
      [schedule, searchQuery, startDate, endDate]
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
      appointmentsQueryParamsWithoutStatisticsFilter.startDate !== undefined &&
      appointmentsQueryParamsWithoutStatisticsFilter.endDate !== undefined &&
      appStore.isLoaded &&
      !isAppointmentsCardListTab,
    [appointmentsQueryParamsWithoutStatisticsFilter, isAppointmentsCardListTab]
  );

  const { data: appointmentsStatistics, isLoading: areStatisticsLoading } =
    useGetScheduleAppointmentsStatistics({
      queryParams: appointmentsQueryParamsWithoutStatisticsFilter,
      enabled: appointmentsQueryEnabled,
    });

  const searchProps = useMemo<SchedulerSearchBlockProps>(
    () => ({
      searchModel,
      onChange: debouncedSearchQuery,
      onClear: handleClearSearchQuery,
    }),
    [searchModel, debouncedSearchQuery, handleClearSearchQuery]
  );

  const moduleIconProps = useMemo<Optional<DefaultHeaderModuleIconProps>>(
    () =>
      schedule
        ? {
            icon: iconStore.getByName(schedule.icon).icon,
            color: iconStore.schedulerColor,
          }
        : undefined,
    [schedule]
  );

  const statsSettingsProps = useMemo(
    () => ({
      opened: statsSettingsOpened,
      toggle: toggleStatsSettings,
    }),
    [statsSettingsOpened, toggleStatsSettings]
  );

  const linkedEntityTypeId = useMemo<Nullable<number>>(
    () => schedule?.entityTypeId ?? null,
    [schedule?.entityTypeId]
  );

  if (!appStore.isLoaded) return <WholePageLoaderWithLogo />;

  const { user: currentUser } = authStore;
  const canAddAppointment = currentUser?.canCreate(PermissionObjectType.SCHEDULE, schedule?.id);

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
        <DefaultHeader
          objectId={schedule?.id}
          moduleName={schedule?.name}
          moduleIconProps={moduleIconProps}
          productType={TutorialProductType.SCHEDULER}
          Controls={
            canAddAppointment &&
            !isReportOpen && (
              <AddRoundButton
                disabled={isScheduleLoading}
                label={t('create_appointment')}
                onClick={handleShowAppointmentModal}
              />
            )
          }
        />
      }
    >
      <Tabs.Panel value={SectionView.OVERVIEW}>
        {isScheduleLoading ? (
          <WholePageLoaderWithLogo ensureSubheaderWithOffset extraOffset="16px" />
        ) : (
          <>
            {schedule && startDate && (
              <VisitsSchedulerComponent
                schedule={schedule}
                startDate={startDate}
                searchProps={searchProps}
                hiddenStatsTypes={hiddenStatsTypes}
                statisticsFilter={statisticsFilter}
                canAddAppointment={canAddAppointment}
                queryParams={appointmentsQueryParamsWithStatisticsFilter}
                areStatisticsLoading={areStatisticsLoading}
                appointmentsStatistics={appointmentsStatistics}
                handleCreateEvent={handleSelectCell}
                handleSelectEvent={handleSelectEvent}
                setStatisticsFilter={setStatisticsFilter}
                handleUpdateEventDnd={handleUpdateEventDnd}
              />
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
                queryParams={appointmentsQueryParamsWithoutStatisticsFilter}
                currentAppointmentId={currentAppointmentId}
                onClose={handleCloseModal}
              />
            )}
          </>
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

SchedulerScheduleViewPage.displayName = 'SchedulerScheduleViewPage';
export { SchedulerScheduleViewPage };
