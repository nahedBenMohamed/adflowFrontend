import { entityTypeStore } from '@/app';
import { authStore } from '@/modules/auth';
import { MakeCallProvider } from '@/modules/fields';
import type { ChatProvider } from '@/modules/multichat';
import { Entity, type Option } from '@/shared';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import type { CardStore } from '../../../../store';
import { MiniCard } from '../MiniCard/MiniCard';
import { AddLinkedEntityButton } from './components';

const MiniCardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const MiniCardWrapper = styled.div`
  margin-bottom: 16px;
`;

interface Props {
  cardStore: CardStore;
  entityTypeId: number;
  entityEmailOptions: Option<string>[];
  isLast?: boolean;
  currentPageEncodedUrl?: string;
  providers?: ChatProvider[];
  reloadFeed: () => void;
  invalidateEntityInCache: (entityId: number) => void;
}

const LinkedEntitiesBlock = observer((props: Props) => {
  const {
    cardStore: {
      entityType,
      linkedEntityStore,
      entity: parentEntity,
      getLinkedEntityTypeFieldSettingsStore,
    },
    entityTypeId,
    entityEmailOptions,
    isLast,
    currentPageEncodedUrl,
    providers,
    reloadFeed,
    invalidateEntityInCache,
  } = props;

  const { user: currentUser } = authStore;

  const et = entityTypeStore.getById(entityTypeId);
  const disabled = parentEntity && !parentEntity.userRights.canEdit;

  const entityForms = linkedEntityStore.getEntityFormsByEntityTypeId(entityTypeId);

  const [alreadySelectedEntities, setAlreadySelectedEntities] = useState<number[]>(() =>
    entityForms.map<number>(e => e.id)
  );

  const [addingLinkedEntity, setAddingLinkedEntity] = useState(false);

  const handleAddEntity = useCallback(async (): Promise<void> => {
    if (addingLinkedEntity) return;

    if (!currentUser) throw new Error(`Failed to add linked entity: user is not authorized`);

    const entity = Entity.createEmpty({
      name: '',
      entityTypeId,
      userId: currentUser.id,
      entityId: -1,
    });

    try {
      setAddingLinkedEntity(true);

      await linkedEntityStore.addLinkedEntityForm(entity);
    } finally {
      setAddingLinkedEntity(false);
    }
  }, [entityTypeId, linkedEntityStore, currentUser, addingLinkedEntity]);

  const getUnpinEntityHandler = useCallback<(entityFormId: number) => () => void>(
    (entityFormId: number) => () => linkedEntityStore.unpinLinkedEntityForm(entityFormId),
    [linkedEntityStore]
  );

  const onDragEnd = useCallback(
    ({ source, destination }: DropResult) => {
      if (!destination || destination.index === source.index) return;

      const [moved] = entityForms.splice(source.index, 1);

      if (!moved) throw new Error('Failed to end drag, nothing was moved');

      entityForms.splice(destination.index, 0, moved);

      entityForms.forEach((l, idx) =>
        linkedEntityStore.changeEntityFormSortOrder({ originalId: l.id, newSortOrder: idx })
      );
    },
    [entityForms, linkedEntityStore]
  );

  const handleInvalidateParentEntityInCache = useCallback(
    () => (parentEntity ? invalidateEntityInCache(parentEntity.id) : undefined),
    [parentEntity, invalidateEntityInCache]
  );

  const parentEntityTypeId = useMemo<number>(
    () => (parentEntity ? parentEntity.entityTypeId : entityType ? entityType.id : -1),
    [entityType, parentEntity]
  );

  if (!entityForms.length && disabled) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="workspace__LinkedEntitiesBLock--MiniCardsWrapper">
        {provided => (
          <MiniCardsWrapper ref={provided.innerRef} {...provided.droppableProps}>
            {entityForms.map((ef, idx) => (
              <Draggable key={ef.id} index={idx} draggableId={String(ef.id)}>
                {provided => (
                  <MiniCardWrapper ref={provided.innerRef} {...provided.draggableProps}>
                    <MakeCallProvider>
                      <MiniCard
                        isLast={isLast}
                        entityForm={ef}
                        providers={providers}
                        parentEntity={parentEntity}
                        parentEntityTypeId={parentEntityTypeId}
                        entityEmailOptions={entityEmailOptions}
                        dragHandleProps={provided.dragHandleProps}
                        currentPageEncodedUrl={currentPageEncodedUrl}
                        alreadySelectedEntities={alreadySelectedEntities}
                        fieldSettingsStore={getLinkedEntityTypeFieldSettingsStore(ef.entityTypeId)}
                        reloadFeed={reloadFeed}
                        unpinEntity={getUnpinEntityHandler(ef.id)}
                        replaceEntity={linkedEntityStore.replaceLinkedEntity}
                        setAlreadySelectedEntities={setAlreadySelectedEntities}
                        handleInvalidateParentEntityInCache={handleInvalidateParentEntityInCache}
                      />
                    </MakeCallProvider>
                  </MiniCardWrapper>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            {!disabled && (
              <AddLinkedEntityButton
                et={et}
                addingLinkedEntity={addingLinkedEntity}
                handleAddEntity={handleAddEntity}
              />
            )}
          </MiniCardsWrapper>
        )}
      </Droppable>
    </DragDropContext>
  );
});

LinkedEntitiesBlock.displayName = 'LinkedEntitiesBlock';
export { LinkedEntitiesBlock };
