import { WholePageLoaderWithLogo, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import type { CreateTaskDto, TaskBoardFilterDto } from '../../api';
import { TasksColumn, type BaseTask, type Task } from '../../shared';
import type { TasksGroupStore } from '../../store';
import { TasksPageTemplate } from '../TasksPageTemplate/TasksPageTemplate';

interface Props {
  taskGroupStore: TasksGroupStore;
  loading: boolean;
  entityId: number;
  entityTypeId: number;
  canEditBoard: boolean;
  filterDto: TaskBoardFilterDto;
  metaLoaded: boolean;
  boardId?: number;
  currentPageEncodedUrl?: string;
  handleAddTask: (dto: CreateTaskDto) => Promise<void>;
  syncState?: (task: Task) => void;
  handleDeleteTask?: Nullable<(taskId: number) => void>;
  handleToggleResolve?: (task: BaseTask) => void;
}

const TasksBoardPageTemplate = observer((props: Props) => {
  const {
    taskGroupStore,
    loading,
    entityId,
    entityTypeId,
    canEditBoard,
    filterDto,
    metaLoaded,
    boardId,
    currentPageEncodedUrl,
    handleAddTask,
    syncState,
    handleToggleResolve,
    handleDeleteTask,
  } = props;

  const [isAllowedGrabbing, setIsAllowedGrabbing] = useState(true);

  const handleAllowGrabbing = useCallback(() => setIsAllowedGrabbing(true), [setIsAllowedGrabbing]);
  const handleDisallowGrabbing = useCallback(
    () => setIsAllowedGrabbing(false),
    [setIsAllowedGrabbing]
  );

  return (
    <TasksPageTemplate
      withoutSidebar
      filterDto={filterDto}
      taskGroupStore={taskGroupStore}
      isAllowedGrabbing={isAllowedGrabbing}
      syncState={syncState}
      handleDeleteTask={handleDeleteTask}
      handleToggleResolve={handleToggleResolve}
      setIsAllowedGrabbing={setIsAllowedGrabbing}
    >
      {loading ? (
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      ) : (
        taskGroupStore.taskGroups.map(tg => (
          <TasksColumn
            key={tg.id}
            taskGroup={tg}
            boardId={boardId}
            entityId={entityId}
            metaLoaded={metaLoaded}
            entityTypeId={entityTypeId}
            canEditBoard={canEditBoard}
            taskGroupStore={taskGroupStore}
            currentPageEncodedUrl={currentPageEncodedUrl}
            addTaskCard={handleAddTask}
            handleMouseUpOnCard={handleAllowGrabbing}
            handleMouseDownOnCard={handleDisallowGrabbing}
          />
        ))
      )}
    </TasksPageTemplate>
  );
});

TasksBoardPageTemplate.displayName = 'TasksBoardPageTemplate';
export { TasksBoardPageTemplate };
