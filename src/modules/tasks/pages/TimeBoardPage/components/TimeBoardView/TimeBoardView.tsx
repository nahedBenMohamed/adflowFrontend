import { appStore } from '@/app';
import { SwipeableContainer } from '@/modules/section';
import {
  SELECTED_TASK_ID_PARAM,
  TaskColumnsWrapper,
  TasksBoardType,
  TasksColumn,
  TasksFilterType,
  UpdateTaskModal,
  findSavedTasksFilter,
  timeBoardPageStore,
} from '@/modules/tasks';
import {
  ManualSorting,
  UriCodingUtil,
  WholePageLoaderWithLogo,
  lastTasksBoardService,
  useGrabScroll,
} from '@/shared';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';

const SWIPEABLE_CONTAINER_ID = 'workspace__TasksBoard--SwipeableContainer';

const TimeBoardView = observer(() => {
  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_by_deadline',
  });

  const { pathname, search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isAllowedGrabbing, { open: allowGrabbing, close: disallowGrabbing }] =
    useDisclosure(false);

  const selectedTaskIdAsString = searchParams.get(SELECTED_TASK_ID_PARAM);
  const selectedTaskId = selectedTaskIdAsString ? Number(selectedTaskIdAsString) : null;
  const [isTaskModalOpened, { close: hideTaskModal, open: showTaskModal }] = useDisclosure(false);

  useEffect(() => {
    if (!appStore.isLoaded) return;

    const savedFilter = findSavedTasksFilter({
      boardId: null,
      filterType: TasksFilterType.TIME_BOARD_FILTER,
    });

    timeBoardPageStore.loadData({ filter: savedFilter ?? {}, t });

    return () => timeBoardPageStore.reset();
  }, [t]);

  useEffect(() => {
    lastTasksBoardService.setLastTasksBoardParams({ tasksType: TasksBoardType.TIME_BOARD });
  }, []);

  const { taskGroupStore, isMetaLoaded, filterDto, isLoading, addTask, deleteTaskCard } =
    timeBoardPageStore;

  const { containerRef, tracked, handlers } = useGrabScroll(isAllowedGrabbing);

  useEffect(() => {
    const container = document.getElementById(SWIPEABLE_CONTAINER_ID);

    if (!container) return;

    // to prevent text select and grab scroll conflicts
    container.addEventListener('focusin', disallowGrabbing);
    container.addEventListener('focusout', () => allowGrabbing);

    return () => {
      container.removeEventListener('focusin', disallowGrabbing);
      container.removeEventListener('focusout', allowGrabbing);
    };
  }, [allowGrabbing, disallowGrabbing]);

  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const closeTaskModal = useCallback(() => {
    setSearchParams(prev => {
      prev.delete(SELECTED_TASK_ID_PARAM);

      return prev;
    });

    hideTaskModal();
  }, [hideTaskModal, setSearchParams]);

  useEffect(() => {
    if (selectedTaskId) showTaskModal();
  }, [selectedTaskId, showTaskModal]);

  const onDragEnd = useCallback(
    async ({ source, destination }: DropResult) => {
      const isDroppedNowhere = !destination;
      const isNotMoved =
        source.droppableId === destination?.droppableId && source.index === destination.index;

      allowGrabbing();

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
    [allowGrabbing, taskGroupStore, filterDto.sorting]
  );

  if (isLoading) return <WholePageLoaderWithLogo ensureSubheaderWithOffset />;

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {provided => (
            <div ref={containerRef}>
              <SwipeableContainer id={SWIPEABLE_CONTAINER_ID} $tracked={tracked} {...handlers}>
                <TaskColumnsWrapper ref={provided.innerRef} {...provided.droppableProps}>
                  {taskGroupStore.taskGroups.map(tg => (
                    <TasksColumn
                      key={tg.id}
                      taskGroup={tg}
                      entityId={null}
                      canEditBoard={false}
                      metaLoaded={isMetaLoaded}
                      taskGroupStore={taskGroupStore}
                      currentPageEncodedUrl={currentPageEncodedUrl}
                      addTaskCard={addTask}
                      handleMouseUpOnCard={allowGrabbing}
                      handleMouseDownOnCard={disallowGrabbing}
                    />
                  ))}
                </TaskColumnsWrapper>
              </SwipeableContainer>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedTaskId && isTaskModalOpened && (
        <UpdateTaskModal
          id={selectedTaskId}
          isOpened={isTaskModalOpened}
          currentPageEncodedUrl={currentPageEncodedUrl}
          onDelete={deleteTaskCard}
          onClose={closeTaskModal}
        />
      )}
    </>
  );
});

export { TimeBoardView };
