import { entityTypeStore, iconStore, routes } from '@/app';
import { CardCopiedCountTag, TruncateMixin, type Entity } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.div<{ $right: boolean }>`
  flex: 1;

  display: flex;
  align-items: center;
  gap: 8px;

  ${p => p.$right && `justify-content: flex-end`};

  ${TruncateMixin}
`;

const IconWrapper = styled.div`
  height: 24px;
  width: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: var(--button-text-graphite-primary-text);

    transition: var(--transition-200);
  }
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  ${TruncateMixin}
`;

const StyledLink = styled(Link)<{ $moduleColor: string }>`
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    ${IconWrapper} {
      svg rect,
      svg circle,
      svg ellipse,
      svg path {
        fill: ${p => p.$moduleColor};
      }
    }

    ${Title} {
      color: var(--button-text-graphite-primary-text);
    }
  }

  &:active {
    ${Title} {
      color: var(--button-text-graphite-priory-text);
    }
  }

  ${TruncateMixin}
`;

interface Props {
  entity: Entity;
  isRight: boolean;
  currentPageEncodedUrl?: string;
}

const LinkedEntitiesHeaderLinkItem = observer((props: Props) => {
  const {
    entity: { name: entityName, id: entityId, copiedCount, copiedFrom, entityTypeId },
    isRight,
    currentPageEncodedUrl,
  } = props;
  const entityType = entityTypeStore.getById(entityTypeId);

  const section = entityType.section;

  const { icon } = iconStore.getByName(section.icon);
  const moduleColor = iconStore.getEntityColorByEntityCategory(entityType.entityCategory);

  return (
    <Root $right={isRight}>
      <StyledLink
        to={routes.card({
          entityId: entityId,
          from: currentPageEncodedUrl,
          entityTypeId: entityType.id,
        })}
        $moduleColor={moduleColor}
      >
        <IconWrapper>{icon}</IconWrapper>

        <Title>{entityName}</Title>
      </StyledLink>

      {copiedCount && copiedFrom && (
        <CardCopiedCountTag
          copiedFrom={copiedFrom}
          copiedCount={copiedCount}
          entityTypeId={entityTypeId}
          from={currentPageEncodedUrl}
        />
      )}
    </Root>
  );
});

LinkedEntitiesHeaderLinkItem.displayName = 'LinkedEntitiesHeaderLinkItem';
export { LinkedEntitiesHeaderLinkItem };
