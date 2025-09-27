import { SettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  EmptyTableBlock,
  PermissionObjectType,
  WholePageLoaderWithLogo,
  type Nullable,
} from '@/shared';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnResizeMode,
  type VisibilityState,
} from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useIntersectionObserver } from 'usehooks-ts';
import type { CreateTaskDto, TaskBoardFilterDto, TaskSettingsIdentifier } from '../../../../api';
import { taskSettingsStore, type TasksListsPageStore } from '../../../../store';
import { getTasksDefaultColumnSize } from '../../helpers';
import { useGetTasksListColumns, useGetTasksListData } from '../../hooks';
import {
  SELECTED_TASK_ID_PARAM,
  TasksColumnsIds,
  type TaskRow,
  type TasksTableSettings,
  type TasksTablesSettings,
} from '../../models';
import { EmptyListBlock } from '../EmptyListBlock/EmptyListBlock';
import { UpdateTaskModal } from '../TaskItem/TaskItem/components';
import { TasksListSettingsDrawer, TasksTable } from './components';

const Root = styled.div`
  position: relative;

  width: fit-content;
  max-height: calc(100dvh - var(--header-with-subheader-height));

  display: flex;
  flex-direction: column;

  overflow-y: auto;
  // 2px on the left – to prevent shadow from clipping
  padding: 0 16px 0 2px;
`;

const LoadMoreObserver = styled.div`
  width: 100%;
  height: 16px;

  pointer-events: none;
`;

interface Props {
  boardId: number;
  filterDto: TaskBoardFilterDto;
  settingsDrawerOpened: boolean;
  selectedTaskId: Nullable<number>;
  identifier: TaskSettingsIdentifier;
  tasksListPageStore: TasksListsPageStore;
  entityId?: Nullable<number>;
  currentPathname?: string;
  hideSettingsDrawer: () => void;
}

const { settings: settingsFromLS } =
  SettingsStore.getSettingsStore<TasksTablesSettings>('TasksList');

if (!settingsFromLS.tables) settingsFromLS.tables = [];

const TasksList = observer((props: Props) => {
  const {
    boardId,
    filterDto,
    settingsDrawerOpened,
    selectedTaskId,
    identifier,
    tasksListPageStore,
    entityId = null,
    currentPathname,
    hideSettingsDrawer,
  } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_list',
  });

  const tableSettingsFromLS = settingsFromLS.tables.find(
    t => t.boardId === boardId && t.entityId === entityId
  );

  const currentUser = authStore.user;

  const rootRef = useRef<HTMLDivElement>(null);

  const [, setSearchParams] = useSearchParams();

  const { tasks, isLoaded, deleteTask, toggleResolve, syncState, addTask, loadMore } =
    tasksListPageStore;

  const { isIntersecting, ref } = useIntersectionObserver({
    rootMargin: '600px',
    root: rootRef.current,
  });

  useEffect(() => {
    if (isIntersecting)
      loadMore({
        boardId,
        filterDto: entityId ? { ...filterDto, entityIds: [entityId] } : filterDto,
      });
  }, [isIntersecting, boardId, filterDto, entityId, loadMore]);

  const getSavedColumnVisibility = useCallback((): VisibilityState => {
    if (!tableSettingsFromLS) return {};

    return tableSettingsFromLS.columnVisibility;
  }, [tableSettingsFromLS]);

  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    getSavedColumnVisibility()
  );

  const getSavedColumnSize = useCallback(
    (columnId: string): number => {
      const defaultSize = getTasksDefaultColumnSize(columnId);

      if (!tableSettingsFromLS) return defaultSize;

      return tableSettingsFromLS.columnSizes[columnId] ?? defaultSize;
    },
    [tableSettingsFromLS]
  );

  const data = useGetTasksListData(tasks);
  const columns = useGetTasksListColumns({
    boardId,
    currentPathname,
    store: tasksListPageStore,
    getSavedColumnSize,
  });

  const table = useReactTable<TaskRow>({
    data,
    columns,
    columnResizeMode,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    const saveColumnVisibility = (columnVisibility: VisibilityState) => {
      if (!tableSettingsFromLS)
        settingsFromLS.tables = [
          ...settingsFromLS.tables,
          {
            boardId,
            entityId,
            columnSizes: {},
            columnVisibility,
          },
        ];

      settingsFromLS.tables = settingsFromLS.tables.map<TasksTableSettings>(t => {
        if (t.boardId === boardId && t.entityId === entityId) t.columnVisibility = columnVisibility;

        return t;
      });
    };

    saveColumnVisibility(columnVisibility);
  }, [columnVisibility, tableSettingsFromLS, boardId, entityId]);

  const saveColumnSize = useCallback(
    ({ columnId, size }: { columnId: string; size: number }) => {
      if (!tableSettingsFromLS)
        settingsFromLS.tables = [
          ...settingsFromLS.tables,
          {
            boardId,
            entityId,
            columnSizes: {},
            columnVisibility: {},
          },
        ];

      settingsFromLS.tables = settingsFromLS.tables.map<TasksTableSettings>(t => {
        if (t.boardId === boardId && t.entityId === entityId)
          t.columnSizes = { ...t.columnSizes, [columnId]: size };

        return t;
      });
    },
    [boardId, entityId, tableSettingsFromLS]
  );

  const handleAddTask = useCallback(
    async (dto: CreateTaskDto): Promise<void> => {
      dto.settingsId = (await taskSettingsStore.findOrCreateByIdentifier(identifier)).id;

      await addTask(dto);
    },
    [identifier, addTask]
  );

  const handleCloseTaskModal = useCallback(() => {
    setSearchParams(prev => {
      prev.delete(SELECTED_TASK_ID_PARAM);

      return prev;
    });
  }, [setSearchParams]);

  const allColumnsHiddenExceptCheckboxAndDelete = table
    .getAllColumns()
    .filter(
      c => ![TasksColumnsIds.CHECKBOX, TasksColumnsIds.DELETE].includes(c.id as TasksColumnsIds)
    )
    .every(c => !c.getIsVisible());

  return (
    <>
      <TasksListSettingsDrawer
        table={table}
        opened={settingsDrawerOpened}
        hide={hideSettingsDrawer}
      />

      {!isLoaded && <WholePageLoaderWithLogo ensureSubheaderWithOffset />}

      {isLoaded && !data.length && (
        <EmptyListBlock
          boardId={boardId}
          entityId={entityId}
          identifier={identifier}
          canCreate={Boolean(currentUser?.canCreate(PermissionObjectType.TASK))}
          handleAddTask={handleAddTask}
        />
      )}

      {isLoaded &&
        (allColumnsHiddenExceptCheckboxAndDelete ? (
          <EmptyTableBlock $height="400px">{t('all_columns_hidden')}</EmptyTableBlock>
        ) : (
          data.length > 0 && (
            <Root ref={rootRef}>
              <TasksTable
                tasksTable={table}
                isLoaded={isLoaded}
                columnResizeMode={columnResizeMode}
                saveColumnSize={saveColumnSize}
              />

              <LoadMoreObserver ref={ref} />
            </Root>
          )
        ))}

      {selectedTaskId && syncState && (
        <UpdateTaskModal
          id={selectedTaskId}
          isOpened={Boolean(selectedTaskId)}
          currentPageEncodedUrl={currentPathname}
          syncState={syncState}
          onDelete={deleteTask}
          onClose={handleCloseTaskModal}
          handleToggleResolve={toggleResolve}
        />
      )}
    </>
  );
});

TasksList.displayName = 'TasksList';
export { TasksList };
