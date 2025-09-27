import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  ManualSorting,
  PermissionObjectType,
  WholePageLoaderWithLogo,
  useGrabScroll,
  type EntityType,
} from '@/shared';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { entitiesCardStore, stageGroupStore } from '../../../../store';
import type { EntityBoardCardFilter } from '../../models';
import { SwipeableContainer } from '../SwipeableContainer/SwipeableContainer';
import { EntitiesColumn } from './components';

const Wrapper = styled.div`
  min-height: calc(100dvh - var(--header-with-subheader-height) - var(--board-offset));

  display: flex;

  margin-top: 10px;
  margin-left: 5px;
`;

interface Props {
  entityType: EntityType;
  boardId: number;
  showSkeleton: boolean;
  priceHidden: boolean;
  currentPageEncodedUrl: string;
  filter: EntityBoardCardFilter;
  savedFilter?: EntityBoardCardFilter;
}

const EntitiesBoard = observer((props: Props) => {
  const {
    entityType,
    boardId,
    showSkeleton,
    priceHidden,
    filter,
    currentPageEncodedUrl,
    savedFilter,
  } = props;

  const currentUser = authStore.user;

  const { stageGroups, loadData, reset } = stageGroupStore;
  const { isMetaLoaded } = entitiesCardStore;

  const [isAllowedGrabScrolling, { open: allowGrabScrolling, close: disallowGrabScrolling }] =
    useDisclosure(true);

  const { containerRef, tracked, handlers } = useGrabScroll(isAllowedGrabScrolling);

  useEffect(() => {
    loadData({ boardId: boardId, entityTypeId: entityType.id, filter: savedFilter ?? {} });

    return () => reset();
  }, [boardId, entityType.id, savedFilter, reset, loadData]);

  const createEntityPath = currentUser?.canCreate(PermissionObjectType.ENTITY_TYPE, entityType.id)
    ? routes.addCard({ entityTypeId: entityType.id, boardId, from: currentPageEncodedUrl })
    : null;

  const onDragEnd = useCallback(
    ({ source, destination }: DropResult) => {
      const isDroppedNowhere = !destination;
      const isNotMoved =
        source.droppableId === destination?.droppableId && source.index === destination.index;

      allowGrabScrolling();

      if (isDroppedNowhere || isNotMoved) return;

      const { findGroup, moveCard, dropCard } = stageGroupStore;

      const sourceGroupId = +source.droppableId;
      const destinationGroupId = +destination.droppableId;

      const destinationGroup = findGroup(destinationGroupId);
      const sourceGroup = findGroup(sourceGroupId);
      const entity = sourceGroup?.entities[source.index];

      const isManualSortingApplied = !filter.sorting;

      if (sourceGroupId === destinationGroupId && !isManualSortingApplied) return;

      if (entity) {
        const oldGroupId = sourceGroup.id;
        const oldIdx = source.index;

        moveCard({
          id: entity.id,
          atIdx: destination.index,
          atGroupId: destinationGroupId,
        });

        const afterEntity = destinationGroup?.entities[destination.index - 1];
        const beforeEntity = destinationGroup?.entities[destination.index + 1];

        const updateManualSortingOrderDto = new ManualSorting({
          afterId: afterEntity?.id,
          beforeId: beforeEntity?.id,
        });

        dropCard({
          oldIdx,
          oldGroupId,
          entityId: entity.id,
          stageId: destinationGroupId,
          sorting: updateManualSortingOrderDto,
        });
      }
    },
    [filter.sorting, allowGrabScrolling]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {provided => (
          <div ref={containerRef}>
            <SwipeableContainer $tracked={tracked} {...handlers}>
              <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
                {showSkeleton ? (
                  <WholePageLoaderWithLogo ensureSubheaderWithOffset />
                ) : (
                  stageGroups.map((g, idx) => {
                    if (g.stage.isSystem && filter.excludeStageIds?.includes(g.stage.id))
                      return null;

                    return (
                      <EntitiesColumn
                        key={g.id}
                        filter={filter}
                        stageGroup={g}
                        metaLoaded={isMetaLoaded}
                        priceHidden={priceHidden}
                        currentPageEncodedUrl={currentPageEncodedUrl}
                        createEntityPath={idx === 0 ? createEntityPath : null}
                        handleMouseUpOnCard={allowGrabScrolling}
                        handleMouseDownOnCard={disallowGrabScrolling}
                      />
                    );
                  })
                )}
              </Wrapper>
            </SwipeableContainer>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

EntitiesBoard.displayName = 'EntitiesBoard';
export { EntitiesBoard };
