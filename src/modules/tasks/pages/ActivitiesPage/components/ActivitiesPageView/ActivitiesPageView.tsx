import { appStore } from '@/app';
import { SwipeableContainer } from '@/modules/section';
import {
  TaskColumnsWrapper,
  TasksBoardType,
  TasksColumn,
  TasksFilterType,
  activitiesPageStore,
  findSavedTasksFilter,
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
import { useLocation } from 'react-router-dom';

const SWIPEABLE_CONTAINER_ID = 'workspace__TasksBoard--SwipeableContainer';

const ActivitiesPageView = observer(() => {
  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_by_deadline',
  });

  const { pathname, search } = useLocation();

  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const [isAllowedGrabbing, { open: allowGrabbing, close: disallowGrabbing }] =
    useDisclosure(false);
  const { containerRef, tracked, handlers } = useGrabScroll(isAllowedGrabbing);

  useEffect(() => {
    if (!appStore.isLoaded) return;

    const savedFilter = findSavedTasksFilter({
      boardId: null,
      filterType: TasksFilterType.ACTIVITY_CARDS_FILTER,
    });

    activitiesPageStore.loadData({ filter: savedFilter ?? {}, t });

    return () => activitiesPageStore.reset();
  }, [t]);

  useEffect(() => {
    lastTasksBoardService.setLastTasksBoardParams({ tasksType: TasksBoardType.ACTIVITIES });
  }, []);

  const { taskGroupStore, isMetaLoaded, filterDto, isLoading } = activitiesPageStore;

  useEffect(() => {
    const container = document.getElementById(SWIPEABLE_CONTAINER_ID);

    if (!container) return;

    // to prevent text select and grab scroll conflicts
    container.addEventListener('focusin', disallowGrabbing);
    container.addEventListener('focusout', allowGrabbing);

    return () => {
      container.removeEventListener('focusin', disallowGrabbing);
      container.removeEventListener('focusout', allowGrabbing);
    };
  }, [allowGrabbing, disallowGrabbing]);

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

  if (!appStore.isLoaded || isLoading) return <WholePageLoaderWithLogo ensureSubheaderWithOffset />;

  return (
    <div>
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
    </div>
  );
});

export { ActivitiesPageView };
