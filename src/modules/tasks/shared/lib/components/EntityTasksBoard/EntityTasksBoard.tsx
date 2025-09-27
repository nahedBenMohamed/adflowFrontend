import { authStore } from '@/modules/auth';
import { findSavedTasksFilter } from '@/modules/tasks';
import { EntityApiUtil } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { TaskBoardFilterDto, type CreateTaskDto } from '../../../../api';
import type { TasksBoardPageStore } from '../../../../store';
import { TasksBoardPageTemplate } from '../../../../templates';
import { TasksFilterType } from '../../models';

interface Props {
  boardId: number;
  entityId: number;
  entityTypeId: number;
  tasksPageStore: TasksBoardPageStore;
  filterDto: TaskBoardFilterDto;
  currentPageEncodedUrl?: string;
  handleAddTask: (dto: CreateTaskDto) => Promise<void>;
}

const EntityTasksBoard = observer((props: Props) => {
  const {
    boardId,
    entityId,
    entityTypeId,
    tasksPageStore,
    filterDto,
    currentPageEncodedUrl,
    handleAddTask,
  } = props;

  const [isProjectOwner, setIsProjectOwner] = useState(false);

  const { user: currentUser } = authStore;

  const {
    taskGroupStore,
    isMetaLoaded,
    isLoading,
    deleteTask,
    syncState,
    toggleResolved,
    loadData,
    reset,
  } = tasksPageStore;

  useEffect(() => {
    const ensureProjectOwner = async (): Promise<void> => {
      const entity = await EntityApiUtil.getById(entityId);

      if (currentUser) setIsProjectOwner(entity.responsibleUserId === currentUser.id);
    };

    ensureProjectOwner();
  }, [entityId, currentUser]);

  useEffect(() => {
    const filter = findSavedTasksFilter({
      boardId,
      filterType: TasksFilterType.TASK_BOARD_FILTER,
    });

    loadData({
      boardId,
      // there is no filter by linked entities on EntityTasksBoard, but we need to
      // pass current entityId to get tasks for it, not for all project entities
      filterDto: filter
        ? { ...TaskBoardFilterDto.fromModel(filter), entityIds: [entityId] }
        : { entityIds: [entityId] },
    });

    return () => reset();
  }, [boardId, entityId, loadData, reset]);

  return (
    <TasksBoardPageTemplate
      boardId={boardId}
      loading={isLoading}
      entityId={entityId}
      filterDto={filterDto}
      metaLoaded={isMetaLoaded}
      entityTypeId={entityTypeId}
      taskGroupStore={taskGroupStore}
      currentPageEncodedUrl={currentPageEncodedUrl}
      canEditBoard={isProjectOwner || authStore.isAdmin()}
      syncState={syncState}
      handleAddTask={handleAddTask}
      handleDeleteTask={deleteTask}
      handleToggleResolve={toggleResolved}
    />
  );
});

EntityTasksBoard.displayName = 'EntityTasksBoard';
export { EntityTasksBoard };
