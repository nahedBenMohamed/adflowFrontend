import { routes } from '@/app';
import { TruncateMixin, type EntityInfo, type Nullable } from '@/shared';
import { Transition } from '@mantine/core';
import { memo } from 'react';
import styled from 'styled-components';
import { EntityLink } from '../EntityLink/EntityLink';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  ${TruncateMixin}
`;

interface Props {
  entityInfo: Nullable<EntityInfo>;
  linkedEntityInfo: Nullable<EntityInfo>;
  fold: () => void;
}

const EntitiesLinksBlock = memo((props: Props) => {
  const { entityInfo, linkedEntityInfo, fold } = props;

  return (
    <Transition mounted={Boolean(entityInfo)} transition="pop">
      {transitionStyles => (
        <Root style={transitionStyles}>
          {entityInfo && (
            <EntityLink
              entityName={entityInfo.name}
              disabled={!entityInfo.hasAccess}
              to={routes.card({ entityTypeId: entityInfo.entityTypeId, entityId: entityInfo.id })}
              onClick={fold}
            />
          )}

          {linkedEntityInfo && (
            <EntityLink
              variant="small"
              entityName={linkedEntityInfo.name}
              disabled={!linkedEntityInfo.hasAccess}
              to={routes.card({
                entityId: linkedEntityInfo.id,
                entityTypeId: linkedEntityInfo.entityTypeId,
              })}
              onClick={fold}
            />
          )}
        </Root>
      )}
    </Transition>
  );
});

EntitiesLinksBlock.displayName = 'EntitiesLinksBlock';
export { EntitiesLinksBlock };
