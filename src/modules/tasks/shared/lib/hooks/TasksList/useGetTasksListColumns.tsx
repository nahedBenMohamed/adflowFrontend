import { userStore } from '@/app';
import { UserView } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TasksListsPageStore } from '../../../../store';
import {
  TaskActionHeaderCell,
  TaskCheckboxCell,
  TaskCheckboxHeaderCell,
  TaskDeleteCell,
  TaskEndDateCell,
  TaskLinkedEntityCell,
  TaskPlannedTimeCell,
  TaskResponsibleCell,
  TaskStageCell,
  TaskStartDateCell,
  TaskTitleCell,
} from '../../components';
import {
  TasksColumnsIds,
  TasksColumnsSizes,
  TasksDefaultColumnsSizes,
  type TaskRow,
} from '../../models';

export const useGetTasksListColumns = ({
  boardId,
  store,
  currentPathname,
  getSavedColumnSize,
}: {
  boardId: number;
  store: TasksListsPageStore;
  currentPathname?: string;
  getSavedColumnSize: (columnId: string) => number;
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'update_task_modal',
  });

  const { toggleResolve, deleteTask } = store;

  const getToggleResolveHandler = useCallback(
    (taskRow: TaskRow) => (): void => {
      taskRow.toggleResolved();

      toggleResolve(taskRow.originalTask);

      // when tasks resolves its stage changes so we need to update stageId model
      taskRow.stageId.setValue(taskRow.originalTask.stageId);
    },
    [toggleResolve]
  );

  const getDeleteTaskHandler = useCallback(
    (taskId: number) => (): void => deleteTask(taskId),
    [deleteTask]
  );

  return useMemo(() => {
    const columnHelper = createColumnHelper<TaskRow>();

    return [
      columnHelper.display({
        id: TasksColumnsIds.CHECKBOX,
        size: TasksColumnsSizes[TasksColumnsIds.CHECKBOX],
        header: TaskCheckboxHeaderCell,
        cell: info => (
          <TaskCheckboxCell cellContext={info} getToggleResolveHandler={getToggleResolveHandler} />
        ),
      }),

      columnHelper.accessor('title', {
        id: TasksColumnsIds.TITLE,
        minSize: TasksColumnsSizes.min,
        maxSize: TasksColumnsSizes.max * 1.5,
        size: getSavedColumnSize(TasksColumnsIds.TITLE),
        header: t('title'),
        cell: info => <TaskTitleCell cellContext={info} />,
      }),

      columnHelper.accessor('stageId', {
        id: TasksColumnsIds.STAGE,
        minSize: TasksColumnsSizes.min,
        maxSize: TasksColumnsSizes.max,
        size: getSavedColumnSize(TasksColumnsIds.STAGE),
        header: t('stage'),
        cell: info => <TaskStageCell boardId={boardId} cellContext={info} />,
      }),

      columnHelper.accessor('entityInfo', {
        id: TasksColumnsIds.ENTITY_INFO,
        maxSize: TasksColumnsSizes.max,
        minSize: TasksDefaultColumnsSizes[TasksColumnsIds.ENTITY_INFO],
        size: getSavedColumnSize(TasksColumnsIds.ENTITY_INFO),
        header: t('linked_card'),
        cell: info => <TaskLinkedEntityCell currentPathname={currentPathname} cellContext={info} />,
      }),

      columnHelper.accessor('plannedTime', {
        id: TasksColumnsIds.PLANNED_TIME,
        maxSize: TasksColumnsSizes.max / 4,
        minSize: TasksDefaultColumnsSizes[TasksColumnsIds.PLANNED_TIME],
        size: getSavedColumnSize(TasksColumnsIds.PLANNED_TIME),
        header: t('planned_time'),
        cell: info => <TaskPlannedTimeCell cellContext={info} />,
      }),

      columnHelper.accessor('startDate', {
        id: TasksColumnsIds.START_DATE,
        minSize: TasksColumnsSizes.min,
        maxSize: TasksColumnsSizes.max,
        size: getSavedColumnSize(TasksColumnsIds.START_DATE),
        header: t('start_date'),
        cell: info => <TaskStartDateCell cellContext={info} />,
      }),

      columnHelper.accessor('endDate', {
        id: TasksColumnsIds.END_DATE,
        minSize: TasksColumnsSizes.min,
        maxSize: TasksColumnsSizes.max,
        size: getSavedColumnSize(TasksColumnsIds.END_DATE),
        header: t('end_date'),
        cell: info => <TaskEndDateCell cellContext={info} />,
      }),

      columnHelper.accessor('responsibleUserId', {
        id: TasksColumnsIds.RESPONSIBLE,
        minSize: TasksColumnsSizes.min,
        maxSize: TasksColumnsSizes.max,
        size: getSavedColumnSize(TasksColumnsIds.RESPONSIBLE),
        header: t('assignee'),
        cell: info => <TaskResponsibleCell cellContext={info} />,
      }),

      columnHelper.accessor('createdBy', {
        id: TasksColumnsIds.CREATED_BY,
        minSize: TasksColumnsSizes.min,
        maxSize: TasksColumnsSizes.max,
        size: getSavedColumnSize(TasksColumnsIds.CREATED_BY),
        header: t('reporter_noun'),
        cell: info => {
          const createdBy = info.getValue();

          return <UserView user={userStore.getById(createdBy)} />;
        },
      }),

      columnHelper.display({
        id: TasksColumnsIds.DELETE,
        size: TasksColumnsSizes[TasksColumnsIds.DELETE],
        header: TaskActionHeaderCell,
        cell: info => {
          const { id: taskId } = info.row.original.originalTask;

          return <TaskDeleteCell cellContext={info} onDelete={getDeleteTaskHandler(taskId)} />;
        },
      }),
    ];
  }, [
    boardId,
    currentPathname,
    getSavedColumnSize,
    getDeleteTaskHandler,
    getToggleResolveHandler,
    t,
  ]);
};
