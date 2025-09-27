import { TruncateMixin, type Entity, type EntityType } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { LinkedEntityStore } from '../../../../store';
import { LinkedEntitiesHeaderLinkItem } from './LinkedEntitiesHeaderLinkItem';

const Root = styled.div`
  width: 100%;

  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  ${TruncateMixin}
`;

interface Props {
  entityType: EntityType;
  linkedEntityStore: LinkedEntityStore;
  currentPageEncodedUrl?: string;
}

const LinkedEntitiesHeaderLinks = observer((props: Props) => {
  const { entityType, linkedEntityStore, currentPageEncodedUrl } = props;

  const getLinkedEntitiesToDisplay = () => {
    const result: Entity[] = [];

    for (const l of entityType.linkedEntityTypes) {
      const entity = linkedEntityStore.getFirstSavedEntityByEntityTypeId(l.targetId);

      if (entity && !result.map<number>(p => p.id).includes(entity.id)) result.push(entity);

      if (result.length === 2) break;
    }

    return result;
  };

  const linkedEntitiesToDisplay = getLinkedEntitiesToDisplay();

  if (linkedEntitiesToDisplay.length === 0) return null;

  return (
    <Root>
      {linkedEntitiesToDisplay.map((e, idx) => (
        <LinkedEntitiesHeaderLinkItem
          key={e.id}
          entity={e}
          isRight={idx === 1}
          currentPageEncodedUrl={currentPageEncodedUrl}
        />
      ))}
    </Root>
  );
});

LinkedEntitiesHeaderLinks.displayName = 'LinkedEntitiesHeaderLinks';
export { LinkedEntitiesHeaderLinks };
