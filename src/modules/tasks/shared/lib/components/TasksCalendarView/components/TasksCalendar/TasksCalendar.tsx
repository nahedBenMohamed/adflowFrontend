import { appStore, generalSettingsStore, routes } from '@/app';
import { FULL_CALENDAR_LICENSE_KEY } from '@/modules/products';
import {
  CalendarView,
  UriCodingUtil,
  UtcDate,
  WholePageLoaderWithLogo,
  type Nullable,
  type Optional,
} from '@/shared';
import type {
  CalendarOptions,
  CustomContentGenerator,
  DateSelectArg,
  DayCellContentArg,
  DayHeaderContentArg,
  DurationInput,
  EventChangeArg,
  EventClickArg,
  EventContentArg,
  EventSourceInput,
  FormatterInput,
  MoreLinkContentArg,
  PluginDef,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import scrollgridPlugin from '@fullcalendar/scrollgrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TasksCalendarContext, type TasksCalendarContextValue } from '../../../../../../context';
import { calendarViewStore } from '../../../../../../store';
import {
  generateTaskCalendarEvents,
  getInitialCalendarView,
  getIsTaskAllDay,
} from '../../../../helpers';
import { Activity, type BaseTask, type TaskColorType } from '../../../../models';
import { DayCellContent } from '../DayCellContent/DayCellContent';
import { DayHeaderDayView } from '../DayHeaderContent/DayHeaderDayView';
import { DayHeaderMonthView } from '../DayHeaderContent/DayHeaderMonthView';
import { DayHeaderWeekView } from '../DayHeaderContent/DayHeaderWeekView';
import { MoreLink } from '../MoreLink/MoreLink';
import { TaskEventAgendaView } from '../TaskEvent/TaskEventAgendaView';
import { TaskEventGridView } from '../TaskEvent/TaskEventGridView';
import { agendaPlugin } from '../TasksCalendarAgendaView/TasksCalendarAgendaView';

// Overlay is used to prevent user from clicking anywhere when the drawer is opened
const Overlay = styled.div`
  inset: 0 0 0 0;
  position: fixed;

  z-index: 400;
  background: transparent;
`;

const plugins: PluginDef[] = [
  timeGridPlugin,
  scrollgridPlugin,
  interactionPlugin,
  dayGridPlugin,
  agendaPlugin,
];

const calendarStyles = {
  dayMinWidth: 120,
} satisfies CalendarOptions;

const minutesSlotDuration: DurationInput = { minute: 15 };
const slotLabelInterval: DurationInput = { minute: 60 };
const slotLabelFormat: FormatterInput = {
  hour: 'numeric',
  minute: '2-digit',
  meridiem: 'short',
};

const dayHeaderFormat: FormatterInput = { weekday: 'long' };

interface Props {
  ref?: Ref<FullCalendar>;
  tasks: BaseTask[];
  isLoading: boolean;
  startDate: UtcDate;
  calendarView: CalendarView;
  taskColorType: TaskColorType;
  selectedTaskId: Nullable<number>;
  editable?: boolean;
  handleChangeNextDate: () => void;
  handleChangePrevDate: () => void;
  handleSelectEvent: (taskId: number) => void;
  handleCreateEvent: (args: DateSelectArg) => void;
  navigateToDate: (date: Date) => void;
  toggleResolved: (task: BaseTask) => void;
  handleUpdateEventDragEnd: (ev: EventChangeArg) => Promise<void>;
}

const TasksCalendar = observer((props: Props) => {
  const {
    ref,
    tasks,
    isLoading,
    startDate,
    calendarView,
    taskColorType,
    selectedTaskId,
    editable,
    handleChangeNextDate,
    handleChangePrevDate,
    handleSelectEvent,
    handleCreateEvent,
    navigateToDate,
    toggleResolved,
    handleUpdateEventDragEnd,
  } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_calendar',
  });

  const { accountSettings, nonWorkingDaysAsNumberArray } = generalSettingsStore;

  const { showWeekend, timeScaleEnabled, timeScaleTo, timeScaleFrom } = calendarViewStore;

  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const currentPageEncodedUrl = useMemo(
    () => UriCodingUtil.encode(`${pathname}${search}`),
    [pathname, search]
  );

  const getIsTaskAllDayHandler = useCallback(
    () =>
      getIsTaskAllDay({
        view: calendarView,
        timeScaleEnabled,
        timeScaleFrom,
        timeScaleTo,
        currentDate: startDate,
        workingTimeFrom: accountSettings?.workingTimeFrom,
        workingTimeTo: accountSettings?.workingTimeTo,
      }),
    [
      timeScaleTo,
      calendarView,
      timeScaleFrom,
      startDate,
      timeScaleEnabled,
      accountSettings?.workingTimeFrom,
      accountSettings?.workingTimeTo,
    ]
  );

  const taskEvents = useMemo<EventSourceInput>(
    () =>
      generateTaskCalendarEvents({
        tasks,
        expandEndDate: [CalendarView.MONTH, CalendarView.WEEK].includes(calendarView),
        isTaskAllDay: getIsTaskAllDayHandler(),
      }),
    [getIsTaskAllDayHandler, calendarView, tasks]
  );

  const hiddenDays = useMemo<Optional<number[]>>(() => {
    if (!showWeekend && nonWorkingDaysAsNumberArray) {
      return nonWorkingDaysAsNumberArray;
    } else {
      return;
    }
  }, [nonWorkingDaysAsNumberArray, showWeekend]);

  const workingTimeTo = useMemo<string>(() => {
    if (
      (!timeScaleEnabled || (timeScaleEnabled && timeScaleTo === undefined)) &&
      accountSettings?.workingTimeTo
    ) {
      return accountSettings.workingTimeTo;
    } else if (timeScaleEnabled && timeScaleTo) {
      return timeScaleTo;
    } else {
      return '24:00:00';
    }
  }, [accountSettings?.workingTimeTo, timeScaleEnabled, timeScaleTo]);

  const workingTimeFrom = useMemo<string>(() => {
    if (
      (!timeScaleEnabled || (timeScaleEnabled && timeScaleFrom === undefined)) &&
      accountSettings?.workingTimeFrom
    ) {
      return accountSettings.workingTimeFrom;
    } else if (timeScaleEnabled && timeScaleFrom) {
      return timeScaleFrom;
    } else {
      return '00:00:00';
    }
  }, [accountSettings?.workingTimeFrom, timeScaleFrom, timeScaleEnabled]);

  const handleSelect = useCallback(
    (args: EventClickArg) => {
      const { event } = args;
      const taskId = Number(event.id);

      const selectedTask = tasks.find(t => t.id === taskId);

      if (!selectedTask?.userRights.canEdit) return;

      if (selectedTask instanceof Activity && selectedTask.entityInfo?.hasAccess) {
        navigate(
          routes.card({
            from: currentPageEncodedUrl,
            entityId: selectedTask.entityInfo.id,
            entityTypeId: selectedTask.entityInfo.entityTypeId,
          })
        );

        return;
      }

      handleSelectEvent(taskId);
    },
    [tasks, currentPageEncodedUrl, handleSelectEvent, navigate]
  );

  const getTaskContentRenderer = useCallback<() => CustomContentGenerator<EventContentArg>>(
    () =>
      function ({ event }) {
        if (calendarView === CalendarView.AGENDA) {
          return (
            <TaskEventAgendaView
              title={event.title}
              task={event.extendedProps.task}
              endDate={UtcDate.fromNullableDate(event.end)}
              startDate={UtcDate.fromNullableDate(event.start)}
              toggleResolved={toggleResolved}
            />
          );
        } else {
          return (
            <TaskEventGridView
              title={event.title}
              task={event.extendedProps.task}
              taskColorType={taskColorType}
              endDate={UtcDate.fromNullableDate(event.end)}
              startDate={UtcDate.fromNullableDate(event.start)}
              toggleResolved={toggleResolved}
            />
          );
        }
      },
    [calendarView, taskColorType, toggleResolved]
  );

  const renderMoreLinkContent = useCallback(
    (content: MoreLinkContentArg) => <MoreLink content={content} />,
    []
  );

  const renderDayCellContent = useCallback(
    (content: DayCellContentArg) => <DayCellContent content={content} />,
    []
  );

  const renderDayHeaderContent = useCallback(
    (content: DayHeaderContentArg) => {
      switch (calendarView) {
        case CalendarView.DAY:
          return (
            <DayHeaderDayView
              content={content}
              onChangeNextDate={handleChangeNextDate}
              onChangePrevDate={handleChangePrevDate}
            />
          );

        case CalendarView.WEEK:
          return <DayHeaderWeekView content={content} />;

        case CalendarView.MONTH:
          return <DayHeaderMonthView content={content} />;
      }
    },
    [calendarView, handleChangePrevDate, handleChangeNextDate]
  );

  const eventMaxStack = useMemo<number>(() => {
    switch (calendarView) {
      case CalendarView.AGENDA:
        return Number.MAX_SAFE_INTEGER;

      case CalendarView.DAY:
        return 10;

      case CalendarView.WEEK:
        return 6;

      case CalendarView.MONTH:
        return 3;
    }
  }, [calendarView]);

  const contextValue = useMemo<TasksCalendarContextValue>(
    () => ({
      onResolve: toggleResolved,
    }),
    [toggleResolved]
  );

  if (!appStore.isLoaded || (isLoading && calendarView === CalendarView.AGENDA))
    return <WholePageLoaderWithLogo ensureSubheaderWithOffset extraOffset="-15px" />;

  return (
    <>
      {Boolean(selectedTaskId) && editable && <Overlay />}

      <TasksCalendarContext.Provider value={contextValue}>
        <FullCalendar
          ref={ref}
          navLinks
          allDaySlot
          nowIndicator
          dayMaxEvents={4}
          plugins={plugins}
          {...calendarStyles}
          events={taskEvents}
          editable={editable}
          headerToolbar={false}
          moreLinkClick="popover"
          selectable={editable}
          hiddenDays={hiddenDays}
          scrollTimeReset={false}
          eventResizableFromStart
          slotEventOverlap={false}
          selectMirror={editable}
          slotMaxTime={workingTimeTo}
          allDayContent={t('all_day')}
          noEventsText={t('no_events')}
          slotMinTime={workingTimeFrom}
          eventMaxStack={eventMaxStack}
          eventDurationEditable={editable}
          slotLabelFormat={slotLabelFormat}
          dayHeaderFormat={dayHeaderFormat}
          slotDuration={minutesSlotDuration}
          initialDate={startDate.formatISO()}
          slotLabelInterval={slotLabelInterval}
          eventOrder="-duration,start,allDay,title"
          schedulerLicenseKey={FULL_CALENDAR_LICENSE_KEY}
          initialView={getInitialCalendarView(calendarView)}
          firstDay={generalSettingsStore.startOfWeekAsNumber}
          locale={generalSettingsStore.accountSettings?.language}
          eventClick={handleSelect}
          select={handleCreateEvent}
          navLinkDayClick={navigateToDate}
          dayCellContent={renderDayCellContent}
          eventChange={handleUpdateEventDragEnd}
          moreLinkContent={renderMoreLinkContent}
          eventContent={getTaskContentRenderer()}
          dayHeaderContent={renderDayHeaderContent}
        />
      </TasksCalendarContext.Provider>
    </>
  );
});

TasksCalendar.displayName = 'TasksCalendar';
export { TasksCalendar };
