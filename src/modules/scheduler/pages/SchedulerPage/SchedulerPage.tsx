import { appStore, entityTypeStore, routes } from '@/app';
import { authStore } from '@/modules/auth';
import { Reports, ReportsSection } from '@/modules/reporting';
import {
  CalendarTabIcon,
  CommonQueryParams,
  ListTabIcon,
  PermissionObjectType,
  ReportsTabIcon,
  SectionView,
  UriCodingUtil,
  UtcDate,
  useTypedParams,
  type TabModel,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useGetSchedule } from '../../api';
import { APPOINTMENT_CARD_LIST_TAB_PREFIX, ScheduleType, SchedulerQueryParams } from '../../shared';
import { SchedulerBoardViewPage } from '../SchedulerBoardViewPage/SchedulerBoardViewPage';
import { SchedulerScheduleViewPage } from '../SchedulerScheduleViewPage/SchedulerScheduleViewPage';

const SchedulerPage = observer(() => {
  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page',
  });

  const { scheduleType, scheduleId, tab } = useTypedParams<{
    scheduleType: ScheduleType;
    scheduleId: number;
    tab: SectionView.OVERVIEW | SectionView.REPORTS | string;
  }>();

  const isReportsTab = tab === SectionView.REPORTS;
  const isAppointmentsCardListTab = tab.includes(APPOINTMENT_CARD_LIST_TAB_PREFIX);

  const { user: currentUser } = authStore;

  const { data: schedule, isLoading: isScheduleLoading } = useGetSchedule({
    scheduleId,
    // to prevent unnecessary rerenders (because section table component, used on this tab, is very heavy regarding performance)
    refetchOnWindowFocus: !isAppointmentsCardListTab,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const startDateFromParams = searchParams.get(SchedulerQueryParams.START_DATE);
  const endDateFromParams = searchParams.get(SchedulerQueryParams.END_DATE);

  const decodedStartDate = startDateFromParams ? UriCodingUtil.decode(startDateFromParams) : null;
  const decodedEndDate = endDateFromParams ? UriCodingUtil.decode(endDateFromParams) : null;

  const parsedStartDate = decodedStartDate ? UtcDate.parseISO(decodedStartDate) : null;
  const parsedEndDate = decodedEndDate ? UtcDate.parseISO(decodedEndDate) : null;

  const hasSectionTab = searchParams.has(CommonQueryParams.SECTION);

  const [
    reportsSettingsDrawerOpened,
    { close: hideReportsSettingsDrawer, open: showReportsSettingsDrawer },
  ] = useDisclosure(false);

  const canViewReports = Boolean(
    currentUser?.canViewReport(PermissionObjectType.SCHEDULE, scheduleId)
  );

  const schedulerTabs = useMemo<TabModel[]>(() => {
    if (!appStore.isLoaded) return [];

    let tabs: TabModel[] = [
      {
        title: t('overview'),
        Icon: <CalendarTabIcon />,
        href: routes.scheduler({
          scheduleId,
          scheduleType,
          tab: SectionView.OVERVIEW,
        }),
      },
      {
        title: t('report'),
        Icon: <ReportsTabIcon />,
        disabled: !canViewReports,
        tooltip: canViewReports ? undefined : t('tooltips.reports_denied'),
        href: routes.schedulerReports({
          scheduleId,
          scheduleType,
          reportsSection: ReportsSection.SCHEDULE_OWNER,
        }),
      },
    ];

    const linkedEntityTypeId = schedule?.entityTypeId;

    if (linkedEntityTypeId)
      tabs = [
        ...tabs.slice(0, 1),
        {
          Icon: <ListTabIcon />,
          title: entityTypeStore.getById(linkedEntityTypeId).section.name,
          href: routes.schedulerClients({
            scheduleId,
            scheduleType,
            entityTypeId: linkedEntityTypeId,
          }),
        },
        ...tabs.slice(1),
      ];

    return tabs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewReports, schedule, scheduleId, scheduleType, appStore.isLoaded, t]);

  useLayoutEffect(() => {
    // if tab is not appointments card list tab -> delete page query param
    if (!isAppointmentsCardListTab)
      setSearchParams(prev => {
        prev.delete(CommonQueryParams.PAGE);

        return prev;
      });

    // if start or end date is not present in url -> set it to default value
    if ((!decodedStartDate || !decodedEndDate) && !isReportsTab && !isAppointmentsCardListTab) {
      setSearchParams(prev => {
        prev.set(SchedulerQueryParams.START_DATE, UtcDate.startOfCurrentDay().formatISO());
        prev.set(SchedulerQueryParams.END_DATE, UtcDate.endOfCurrentDay().formatISO());

        return prev;
      });

      return;
    }

    // if tab is reports and section tab is not present -> set it to default value
    if (isReportsTab && !hasSectionTab)
      setSearchParams(prev => {
        prev.set(CommonQueryParams.SECTION, ReportsSection.SCHEDULE_OWNER);

        return prev;
      });

    // if tab is not reports and section tab is present -> remove it 'cause it's not needed
    if (!isReportsTab && hasSectionTab)
      setSearchParams(prev => {
        prev.delete(CommonQueryParams.SECTION);

        return prev;
      });
  }, [
    isReportsTab,
    hasSectionTab,
    decodedEndDate,
    decodedStartDate,
    isAppointmentsCardListTab,
    setSearchParams,
  ]);

  const ReportsTab = useMemo<ReactNode>(
    () =>
      hasSectionTab && schedule ? (
        <Reports
          schedule={schedule}
          scheduleEntityTypeId={schedule.entityTypeId}
          settingsDrawerOpened={reportsSettingsDrawerOpened}
          hideSettingsDrawer={hideReportsSettingsDrawer}
        />
      ) : null,
    [schedule, hasSectionTab, reportsSettingsDrawerOpened, hideReportsSettingsDrawer]
  );

  switch (scheduleType) {
    case ScheduleType.BOARD:
      return (
        <SchedulerBoardViewPage
          schedule={schedule}
          scheduleId={scheduleId}
          ReportsTab={ReportsTab}
          endDate={parsedEndDate}
          isReportOpen={isReportsTab}
          startDate={parsedStartDate}
          entitiesTabs={schedulerTabs}
          isScheduleLoading={isScheduleLoading}
          showReportsSettingsDrawer={showReportsSettingsDrawer}
        />
      );

    case ScheduleType.SCHEDULE:
      return (
        <SchedulerScheduleViewPage
          schedule={schedule}
          ReportsTab={ReportsTab}
          scheduleId={scheduleId}
          endDate={parsedEndDate}
          isReportOpen={isReportsTab}
          startDate={parsedStartDate}
          entitiesTabs={schedulerTabs}
          isScheduleLoading={isScheduleLoading}
          showReportsSettingsDrawer={showReportsSettingsDrawer}
        />
      );

    default:
      throw new Error(`Unknown schedule type ${scheduleType}`);
  }
});

SchedulerPage.displayName = 'SchedulerPage';
export { SchedulerPage };
