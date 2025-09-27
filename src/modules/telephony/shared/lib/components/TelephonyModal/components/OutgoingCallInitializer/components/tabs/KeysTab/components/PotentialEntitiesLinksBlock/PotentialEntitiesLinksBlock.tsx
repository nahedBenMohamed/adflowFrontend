import { routes } from '@/app';
import { TruncateMixin, type EntityInfo, type Nullable } from '@/shared';
import { Transition } from '@mantine/core';
import styled from 'styled-components';
import { PotentialEntityLink } from '../PotentialEntityLink/PotentialEntityLink';

const Root = styled.div`
  width: 100%;

  height: 30px;

  ${TruncateMixin}
`;

const LinksWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  ${TruncateMixin}
`;

interface Props {
  entityInfo: Nullable<EntityInfo>;
  linkedEntityInfo: Nullable<EntityInfo>;
}

const PotentialEntitiesLinksBlock = (props: Props) => {
  const { entityInfo, linkedEntityInfo } = props;

  return (
    <Root>
      <Transition mounted={Boolean(entityInfo)} transition="pop">
        {transitionStyles => (
          <LinksWrapper style={transitionStyles}>
            {entityInfo && (
              <PotentialEntityLink
                to={routes.card({ entityTypeId: entityInfo.entityTypeId, entityId: entityInfo.id })}
              >
                {entityInfo.name}
              </PotentialEntityLink>
            )}

            {linkedEntityInfo && (
              <PotentialEntityLink
                $small
                to={routes.card({
                  entityTypeId: linkedEntityInfo.entityTypeId,
                  entityId: linkedEntityInfo.id,
                })}
              >
                {linkedEntityInfo.name}
              </PotentialEntityLink>
            )}
          </LinksWrapper>
        )}
      </Transition>
    </Root>
  );
};

export { PotentialEntitiesLinksBlock };
