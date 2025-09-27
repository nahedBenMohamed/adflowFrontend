import {
  type GanttProps,
  GanttRecord,
  type GanttView,
  GanttViewComponent,
  type TimelineRouteGenerator,
} from '@/modules/gantt';
import type { GanttContextValue } from '@/modules/gantt/context';
import { NoSelectMixin, WholePageLoaderWithLogo } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { TaskBoardFilterDto, UpdateTaskDto } from '../../api';
import {
  SELECTED_TASK_ID_PARAM,
  TasksFilterType,
  UpdateTaskDrawer,
  findSavedTasksFilter,
} from '../../shared';
import type { TasksTimelinePageStore } from '../../store';

const Root = styled.div`
  width: 100%;
  height: calc(100dvh - var(--header-with-subheader-height));

  padding: 16px 0;
`;

const GanttWrapper = styled.div`
  height: 100%;

  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0 1px 2px 0 #d0daeb,
    0 0 2px 0 #eef4fe;

  ${NoSelectMixin}
`;

interface Props {
  view: GanttView;
  boardId: number;
  entityId?: number;
  filterDto: TaskBoardFilterDto;
  tasksTimelinePageStore: TasksTimelinePageStore;
  routeGenerator: TimelineRouteGenerator;
}

const TimelinePage = observer((props: Props) => {
  const { view, boardId, entityId, filterDto, tasksTimelinePageStore, routeGenerator } = props;

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTaskIdFromParams = searchParams.get(SELECTED_TASK_ID_PARAM);
  const selectedTaskId = selectedTaskIdFromParams ? Number(selectedTaskIdFromParams) : null;

  const {
    tasks,
    isLoaded,
    canLoadMore,
    isLoadingMore,
    reset,
    addTask,
    loadData,
    loadMore,
    updateTask,
    deleteTask,
    updateTaskTitle,
    toggleResolveTask,
    updateTaskResponsibleUser,
  } = tasksTimelinePageStore;

  useEffect(() => {
    const filter = findSavedTasksFilter({
      boardId,
      filterType: TasksFilterType.TASK_BOARD_FILTER,
    });

    if (entityId) {
      loadData(
        filter
          ? { ...TaskBoardFilterDto.fromModel(filter), entityIds: [entityId] }
          : { entityIds: [entityId] }
      );
    } else {
      loadData(filter ?? {});
    }

    return () => reset();
  }, [boardId, entityId, loadData, reset]);

  // This class might remain from task bar dragging, so we need to get rid of it
  useEffect(() => {
    return () => document.body.classList.remove('no-selection');
  }, []);

  const getBarClickHandler = useCallback<() => GanttProps['onBarClick']>(
    () => record => {
      setSearchParams(prev => {
        prev.set(SELECTED_TASK_ID_PARAM, String(record.id));

        return prev;
      });
    },
    [setSearchParams]
  );

  const handleCloseUpdateTaskDrawer = useCallback(() => {
    setSearchParams(prev => {
      prev.delete(SELECTED_TASK_ID_PARAM);

      return prev;
    });
  }, [setSearchParams]);

  const handleUpdateTask = useCallback<GanttProps['onUpdate']>(
    async (record, startDate, endDate): Promise<boolean> => {
      const taskId = record.id;

      const updatedTask = await updateTask({
        taskId,
        dto: UpdateTaskDto.create({
          endDate,
          startDate,
        }),
      });

      return Boolean(updatedTask);
    },
    [updateTask]
  );

  const getLoadMoreHandler = useCallback(() => () => loadMore(filterDto), [filterDto, loadMore]);

  const tasksContextProps = useMemo<GanttContextValue['tasksProps']>(
    () => ({
      addTask,
      toggleResolveTask,
    }),
    [addTask, toggleResolveTask]
  );

  return (
    <Root>
      <GanttWrapper>
        {isLoaded ? (
          <GanttViewComponent
            view={view}
            data={GanttRecord.fromTasks(tasks)}
            boardId={boardId}
            canLoadMore={canLoadMore}
            entityId={entityId ?? null}
            entityTypeId={null}
            isLoadingMore={isLoadingMore}
            onUpdate={handleUpdateTask}
            tasksProps={tasksContextProps}
            loadMore={getLoadMoreHandler()}
            updateRecordTitle={updateTaskTitle}
            routeGenerator={routeGenerator}
            updateResponsibleUser={updateTaskResponsibleUser}
            onBarClick={getBarClickHandler()}
          />
        ) : (
          <WholePageLoaderWithLogo ensureSubheaderWithOffset extraOffset="32px" />
        )}
      </GanttWrapper>

      {isLoaded && (
        <UpdateTaskDrawer
          id={selectedTaskId}
          opened={Boolean(selectedTaskId)}
          onDeleteTask={deleteTask}
          onResolveTask={toggleResolveTask}
          onUpdateTask={updateTask}
          hide={handleCloseUpdateTaskDrawer}
        />
      )}
    </Root>
  );
});

export { TimelinePage };
