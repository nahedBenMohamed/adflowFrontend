import { appStore } from '@/app';
import { SwipeableContainer } from '@/modules/section';
import {
  LeftNavTemplate,
  ManualSorting,
  Subheader,
  UriCodingUtil,
  WholePageLoaderWithLogo,
  useGrabScroll,
  type Nullable,
} from '@/shared';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import type { TaskBoardFilterDto } from '../../api';
import {
  SELECTED_TASK_ID_PARAM,
  TaskColumnsWrapper,
  UpdateTaskModal,
  type BaseTask,
  type Task,
} from '../../shared';
import type { TasksGroupStore } from '../../store';

const ContentWrapper = styled.div`
  padding-top: var(--subheader-height);
`;

interface Props {
  children: ReactNode;
  Header?: ReactNode;
  SubheaderControls?: ReactNode;
  isAllowedGrabbing: boolean;
  taskGroupStore: TasksGroupStore;
  filterDto: TaskBoardFilterDto;
  withoutSidebar?: boolean;
  setIsAllowedGrabbing: (isPossibleSwiping: boolean) => void;
  syncState?: (task: Task) => void;
  handleToggleResolve?: (task: BaseTask) => void;
  handleDeleteTask?: Nullable<(taskId: number) => void>;
}

const SWIPEABLE_CONTAINER_ID = 'workspace__TasksBoard--SwipeableContainer';

const TasksPageTemplate = observer((props: Props) => {
  const {
    children,
    Header,
    SubheaderControls,
    isAllowedGrabbing,
    taskGroupStore,
    filterDto,
    withoutSidebar,
    setIsAllowedGrabbing,
    syncState,
    handleToggleResolve,
    handleDeleteTask = null,
  } = props;

  const { pathname, search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTaskIdAsString = searchParams.get(SELECTED_TASK_ID_PARAM);
  const selectedTaskId = selectedTaskIdAsString ? Number(selectedTaskIdAsString) : null;
  const [isTaskModalOpened, { close: hideTaskModal, open: showTaskModal }] = useDisclosure(false);

  const { containerRef, tracked, handlers } = useGrabScroll(isAllowedGrabbing);

  useEffect(() => {
    const container = document.getElementById(SWIPEABLE_CONTAINER_ID);

    if (!container) return;

    // to prevent text select and grab scroll conflicts
    container.addEventListener('focusin', () => setIsAllowedGrabbing(false));
    container.addEventListener('focusout', () => setIsAllowedGrabbing(true));

    return () => {
      container.removeEventListener('focusin', () => setIsAllowedGrabbing(false));
      container.removeEventListener('focusout', () => setIsAllowedGrabbing(true));
    };
  }, [setIsAllowedGrabbing]);

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

      setIsAllowedGrabbing(true);

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
    [taskGroupStore, filterDto, setIsAllowedGrabbing]
  );

  const DraggableContent = useMemo(
    () => (
      <>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="column">
            {provided => (
              <div ref={containerRef}>
                <SwipeableContainer id={SWIPEABLE_CONTAINER_ID} $tracked={tracked} {...handlers}>
                  <TaskColumnsWrapper ref={provided.innerRef} {...provided.droppableProps}>
                    {children}
                  </TaskColumnsWrapper>
                </SwipeableContainer>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {selectedTaskId && isTaskModalOpened && syncState && (
          <UpdateTaskModal
            id={selectedTaskId}
            isOpened={isTaskModalOpened}
            currentPageEncodedUrl={currentPageEncodedUrl}
            syncState={syncState}
            onClose={closeTaskModal}
            onDelete={handleDeleteTask}
            handleToggleResolve={handleToggleResolve}
          />
        )}
      </>
    ),
    [
      tracked,
      children,
      handlers,
      containerRef,
      selectedTaskId,
      currentPageEncodedUrl,
      isTaskModalOpened,
      onDragEnd,
      syncState,
      closeTaskModal,
      handleDeleteTask,
      handleToggleResolve,
    ]
  );

  if (!appStore.isLoaded) return <WholePageLoaderWithLogo />;

  return withoutSidebar ? (
    DraggableContent
  ) : (
    <LeftNavTemplate Header={Header}>
      <Subheader Controls={SubheaderControls} />

      <ContentWrapper>{DraggableContent}</ContentWrapper>
    </LeftNavTemplate>
  );
});

TasksPageTemplate.displayName = 'TasksPageTemplate';
export { TasksPageTemplate };
