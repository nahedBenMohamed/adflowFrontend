import { CalendarView, type Nullable, type Option, type UtcDateValue } from '@/shared';
import type { DateSelectArg, EventChangeArg } from '@fullcalendar/core';
import type FullCalendar from '@fullcalendar/react';
import { useDisclosure, useWindowEvent } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useCalendarNavigation } from '../../../../hooks';
import {
  TaskCalendarViewType,
  type AddTaskPreset,
  type BaseTask,
  type TaskCalendarFilterForm,
  type TaskColorType,
  type TaskDeadlineType,
} from '../../../../models';
import type { TaskCalendarRouteGenerator } from '../../../../types';
import { TasksCalendar } from '../TasksCalendar/TasksCalendar';
import { TasksCalendarSidebar } from '../TasksCalendarSidebar/TasksCalendarSidebar';
import { TasksCalendarStylesWrapper } from './TasksCalendarStylesWrapper';

const Root = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
`;

const viewMap: Record<CalendarView, TaskCalendarViewType> = {
  [CalendarView.MONTH]: TaskCalendarViewType.MONTH,
  [CalendarView.WEEK]: TaskCalendarViewType.WEEK,
  [CalendarView.DAY]: TaskCalendarViewType.DAY,
  [CalendarView.AGENDA]: TaskCalendarViewType.AGENDA,
};

interface Props {
  tasks: BaseTask[];
  startDate: UtcDateValue;
  isLoading: boolean;
  stagesOptions: Option<number>[];
  calendarView: CalendarView;
  selectedTaskId: Nullable<number>;
  taskPreset: Nullable<AddTaskPreset>;
  filterForm: TaskCalendarFilterForm;
  editable?: boolean;
  setStage: () => void;
  setLinkedCards: () => void;
  handleClearFilter: () => void;
  toggleSaveFilterSettings: () => void;
  selectUsers: (userIds: number[]) => void;
  routeGenerator: TaskCalendarRouteGenerator;
  handleSelectEvent: (taskId: number) => void;
  handleCreateEvent: (args: DateSelectArg) => void;
  handleChangeCalendarView: (view: CalendarView) => void;
  setTaskDeadlineTypeFilter: (type: TaskDeadlineType) => void;
  setColorType: (color: TaskColorType) => void;
  toggleResolved: (task: BaseTask) => void;
  handleUpdateEventDragEnd: (ev: EventChangeArg) => Promise<void>;
}

const TasksCalendarWrapper = observer((props: Props) => {
  const {
    tasks,
    startDate,
    isLoading,
    stagesOptions,
    calendarView,
    selectedTaskId,
    taskPreset,
    filterForm,
    editable,
    setStage,
    setLinkedCards,
    selectUsers,
    routeGenerator,
    handleSelectEvent,
    handleCreateEvent,
    handleClearFilter,
    toggleSaveFilterSettings,
    handleChangeCalendarView,
    setTaskDeadlineTypeFilter,
    setColorType,
    toggleResolved,
    handleUpdateEventDragEnd,
  } = props;

  const schedulerRef = useRef<FullCalendar>(null);
  const schedulerApi = schedulerRef.current?.getApi();

  const [isSidebarMinimized, { toggle: toggleSidebarMinimized }] = useDisclosure(false);

  const { handleChangeNextDate, handleChangePrevDate, handleChangeDate, handleGoToDay } =
    useCalendarNavigation({ routeGenerator, schedulerApi, calendarView });

  // In this component we use queueMicrotask because calendarApi is using flushSync under the hood
  // and it is not possible to flush sync state in the lifecycle methods

  useEffect(() => {
    if (startDate && schedulerApi) queueMicrotask(() => schedulerApi.gotoDate(startDate.toDate()));
  }, [schedulerApi, startDate]);

  // This function updates the size of calendar alongside left block minimization transition
  const toggleMinimize = useCallback(() => {
    toggleSidebarMinimized();

    queueMicrotask(() => schedulerApi?.updateSize());
  }, [schedulerApi, toggleSidebarMinimized]);

  useEffect(() => {
    if (!schedulerApi) return;

    queueMicrotask(() => {
      schedulerApi.changeView(viewMap[calendarView]);
    });
  }, [calendarView, schedulerApi]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (taskPreset || selectedTaskId || !(e.ctrlKey || e.metaKey)) return;

      switch (e.key) {
        case '1': {
          e.preventDefault();
          handleChangeCalendarView(CalendarView.DAY);

          break;
        }

        case '2': {
          e.preventDefault();
          handleChangeCalendarView(CalendarView.WEEK);

          break;
        }

        case '3': {
          e.preventDefault();
          handleChangeCalendarView(CalendarView.MONTH);

          break;
        }

        case '4': {
          e.preventDefault();
          handleChangeCalendarView(CalendarView.AGENDA);

          break;
        }

        default:
          break;
      }
    },
    [handleChangeCalendarView, selectedTaskId, taskPreset]
  );

  useWindowEvent('keydown', handleKeyDown);

  if (!startDate) return null;

  return (
    <TasksCalendarStylesWrapper $loading={isLoading}>
      <Root>
        <TasksCalendarSidebar
          date={startDate}
          filterForm={filterForm}
          isMinimized={isSidebarMinimized}
          stagesOptions={stagesOptions}
          setStage={setStage}
          setLinkedCards={setLinkedCards}
          selectUsers={selectUsers}
          setColorType={setColorType}
          onChangeDate={handleChangeDate}
          toggleMinimized={toggleMinimize}
          handleClearFilter={handleClearFilter}
          setTaskDeadlineType={setTaskDeadlineTypeFilter}
          toggleSaveFilterSettings={toggleSaveFilterSettings}
          handleChangeCalendarView={handleChangeCalendarView}
        />

        <TasksCalendar
          ref={schedulerRef}
          tasks={tasks}
          isLoading={isLoading}
          startDate={startDate}
          calendarView={calendarView}
          selectedTaskId={selectedTaskId}
          taskColorType={filterForm.colorSelectModel.value}
          navigateToDate={handleGoToDay}
          editable={editable}
          toggleResolved={toggleResolved}
          handleCreateEvent={handleCreateEvent}
          handleSelectEvent={handleSelectEvent}
          handleChangeNextDate={handleChangeNextDate}
          handleChangePrevDate={handleChangePrevDate}
          handleUpdateEventDragEnd={handleUpdateEventDragEnd}
        />
      </Root>
    </TasksCalendarStylesWrapper>
  );
});

TasksCalendarWrapper.displayName = 'TasksCalendarWrapper';
export { TasksCalendarWrapper };
