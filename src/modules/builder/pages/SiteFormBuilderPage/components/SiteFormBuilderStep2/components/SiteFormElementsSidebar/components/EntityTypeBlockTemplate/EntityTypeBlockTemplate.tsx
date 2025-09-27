import { iconStore } from '@/app';
import { SpanWithEllipsis, TruncateMixin, type EntityType } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 4px 8px;
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);

  ${TruncateMixin}
`;

const NameBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px 12px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const IconWrapper = styled.div<{ $iconColor: string }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: auto;
  }

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: ${p => p.$iconColor};
  }
`;

interface Props {
  et: EntityType;
  children: ReactNode;
}

const EntityTypeBlockTemplate = observer((props: Props) => {
  const {
    et: { name, section, entityCategory },
    children,
  } = props;

  const { icon } = iconStore.getByName(section.icon);
  const iconColor = iconStore.getEntityColorByEntityCategory(entityCategory);

  return (
    <Root>
      <NameBlock>
        <IconWrapper $iconColor={iconColor}>{icon}</IconWrapper>

        <SpanWithEllipsis text={name} />
      </NameBlock>

      {children}
    </Root>
  );
});

EntityTypeBlockTemplate.displayName = 'EntityTypeBlockTemplate';
export { EntityTypeBlockTemplate };
