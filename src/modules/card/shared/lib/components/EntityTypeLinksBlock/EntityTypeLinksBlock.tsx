import { entityTypeStore } from '@/app';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import type { EntityTypeLinksStore } from '../../../../store';
import { AddLinkedEntityButton } from '../LinkedEntitiesBlock/components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  margin-bottom: 16px;
`;

interface Props {
  entityTypeLinksStore: EntityTypeLinksStore;
}

const EntityTypeLinksBlock = observer((props: Props) => {
  const { entityTypeLinksStore } = props;

  const { sortedEntityTypeLinks, changeLinkSortOrder } = entityTypeLinksStore;

  const onDragEnd = useCallback(
    ({ source, destination }: DropResult) => {
      if (!destination || destination.index === source.index) return;

      const [moved] = sortedEntityTypeLinks.splice(source.index, 1);

      if (!moved) throw new Error('Failed to end drag, nothing was moved');

      sortedEntityTypeLinks.splice(destination.index, 0, moved);

      sortedEntityTypeLinks.forEach((l, idx) =>
        changeLinkSortOrder({ targetId: l.targetId, newSortOrder: idx })
      );
    },
    [sortedEntityTypeLinks, changeLinkSortOrder]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="workspace__EntityTypeLinksBlock--Root">
        {provided => (
          <Root ref={provided.innerRef} {...provided.droppableProps}>
            {sortedEntityTypeLinks.map((l, idx) => (
              <Draggable key={l.targetId} index={idx} draggableId={String(l.targetId)}>
                {provided => (
                  <ButtonWrapper ref={provided.innerRef} {...provided.draggableProps}>
                    <AddLinkedEntityButton
                      editMode
                      dragHandleProps={provided.dragHandleProps}
                      et={entityTypeStore.getById(l.targetId)}
                    />
                  </ButtonWrapper>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </Root>
        )}
      </Droppable>
    </DragDropContext>
  );
});

EntityTypeLinksBlock.displayName = 'EntityTypeLinksBlock';
export { EntityTypeLinksBlock };
