import { SwipeableContainer } from '@/modules/section';
import { ManualSorting, WholePageLoaderWithLogo, useGrabScroll, type Nullable } from '@/shared';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CreateTaskDto, TaskBoardFilterDto, TaskSettingsIdentifier } from '../../../../api';
import { taskSettingsStore, type TasksBoardPageStore } from '../../../../store';
import { SELECTED_TASK_ID_PARAM } from '../../models';
import { TaskColumnsWrapper } from '../TaskColumnsWrapper/TaskColumnsWrapper';
import { UpdateTaskModal } from '../TaskItem/TaskItem/components/UpdateTaskModal/UpdateTaskModal';
import { TasksColumn } from '../TasksColumn/TasksColumn';

interface Props {
  boardId: number;
  canEditBoard: boolean;
  filterDto: TaskBoardFilterDto;
  selectedTaskId: Nullable<number>;
  tasksPageStore: TasksBoardPageStore;
  identifier: TaskSettingsIdentifier;
  entityId?: Nullable<number>;
  currentPageEncodedUrl?: string;
}

const SWIPEABLE_CONTAINER_ID = 'workspace__TasksBoard--SwipeableContainer';

const TasksBoard = observer((props: Props) => {
  const {
    boardId,
    canEditBoard,
    filterDto,
    selectedTaskId,
    tasksPageStore,
    identifier,
    entityId = null,
    currentPageEncodedUrl,
  } = props;

  const { isLoaded, isMetaLoaded, taskGroupStore, addTask, syncState, deleteTask, toggleResolved } =
    tasksPageStore;

  const [, setSearchParams] = useSearchParams();

  const [isGrabbingAllowed, { open: allowGrabScrolling, close: disallowGrabScrolling }] =
    useDisclosure(true);
  const { containerRef, tracked, handlers } = useGrabScroll(isGrabbingAllowed);

  useEffect(() => {
    const container = document.getElementById(SWIPEABLE_CONTAINER_ID);

    if (!container) return;

    // to prevent text select and grab scroll conflicts
    container.addEventListener('focusin', disallowGrabScrolling);
    container.addEventListener('focusout', allowGrabScrolling);

    return () => {
      container.removeEventListener('focusin', disallowGrabScrolling);
      container.removeEventListener('focusout', allowGrabScrolling);
    };
  }, [allowGrabScrolling, disallowGrabScrolling]);

  const onDragEnd = useCallback(
    async ({ source, destination }: DropResult): Promise<void> => {
      const isDroppedNowhere = !destination;
      const isNotMoved =
        source.droppableId === destination?.droppableId && source.index === destination.index;

      allowGrabScrolling();

      if (isDroppedNowhere || isNotMoved) return;

      const sourceGroupId = Number(source.droppableId);
      const destinationGroupId = Number(destination.droppableId);

      const { dropCard, findGroup, moveCard } = taskGroupStore;

      const destinationGroup = findGroup(destinationGroupId);
      const sourceGroup = findGroup(sourceGroupId);
      const task = sourceGroup?.tasks[source.index];

      const isManualSortingApplied = !filterDto.sorting;

      if (sourceGroupId === destinationGroupId && !isManualSortingApplied) return;

      if (task) {
        moveCard({ id: task.id, atGroupId: destinationGroupId, atIdx: destination.index });

        const afterTask = destinationGroup?.tasks[destination.index - 1];
        const beforeTask = destinationGroup?.tasks[destination.index + 1];

        const updateManualSortingOrderDto = new ManualSorting({
          afterId: afterTask?.id,
          beforeId: beforeTask?.id,
        });

        dropCard({ task, newGroupId: destinationGroupId, sorting: updateManualSortingOrderDto });
      }
    },
    [taskGroupStore, filterDto, allowGrabScrolling]
  );

  const handleAddTask = useCallback(
    async (dto: CreateTaskDto): Promise<void> => {
      const settingsId = (await taskSettingsStore.findOrCreateByIdentifier(identifier)).id;

      dto.settingsId = settingsId;

      await addTask({ dto, filterDto });
    },
    [filterDto, identifier, addTask]
  );

  const handleCloseTaskModal = useCallback(() => {
    setSearchParams(prev => {
      prev.delete(SELECTED_TASK_ID_PARAM);

      return prev;
    });
  }, [setSearchParams]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="workspace__TaskBoard" direction="horizontal" type="column">
          {provided => (
            <div ref={containerRef}>
              <SwipeableContainer id={SWIPEABLE_CONTAINER_ID} $tracked={tracked} {...handlers}>
                <TaskColumnsWrapper ref={provided.innerRef} {...provided.droppableProps}>
                  {isLoaded ? (
                    taskGroupStore.taskGroups.map(tg => (
                      <TasksColumn
                        key={tg.id}
                        taskGroup={tg}
                        boardId={boardId}
                        entityId={entityId}
                        metaLoaded={isMetaLoaded}
                        canEditBoard={canEditBoard}
                        taskGroupStore={taskGroupStore}
                        currentPageEncodedUrl={currentPageEncodedUrl}
                        addTaskCard={handleAddTask}
                        handleMouseUpOnCard={allowGrabScrolling}
                        handleMouseDownOnCard={disallowGrabScrolling}
                      />
                    ))
                  ) : (
                    <WholePageLoaderWithLogo ensureSubheaderWithOffset />
                  )}
                </TaskColumnsWrapper>
              </SwipeableContainer>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedTaskId && syncState && (
        <UpdateTaskModal
          id={selectedTaskId}
          isOpened={Boolean(selectedTaskId)}
          currentPageEncodedUrl={currentPageEncodedUrl}
          syncState={syncState}
          onDelete={deleteTask}
          onClose={handleCloseTaskModal}
          handleToggleResolve={toggleResolved}
        />
      )}
    </>
  );
});

TasksBoard.displayName = 'TasksBoard';
export { TasksBoard };
