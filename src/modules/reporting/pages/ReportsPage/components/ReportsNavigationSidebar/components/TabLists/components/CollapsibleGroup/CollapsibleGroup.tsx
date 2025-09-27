import { SpanWithEllipsis, TruncateMixin } from '@/shared';
import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { memo, type ReactNode } from 'react';
import styled from 'styled-components';
import { CaretIcon } from '../../../../../../../../shared';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;

  ${TruncateMixin}
`;

const Title = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 8px 16px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-20);
  }

  &:active {
    color: var(--button-text-graphite-priory-text);
  }

  ${TruncateMixin}
`;

const IconWrapper = styled.div<{ $active: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: ${p => (p.$active ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: var(--transition-200);
`;

const Content = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 8px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  title: string;
  children: ReactNode;
}

const CollapsibleGroup = memo((props: Props) => {
  const { title, children } = props;

  const [collapsed, { toggle }] = useDisclosure(true);

  return (
    <Root>
      <Title onClick={toggle}>
        <SpanWithEllipsis text={title} />

        <IconWrapper $active={collapsed}>
          <CaretIcon />
        </IconWrapper>
      </Title>

      <Collapse in={collapsed}>
        <Content>{children}</Content>
      </Collapse>
    </Root>
  );
});

CollapsibleGroup.displayName = 'CollapsibleGroup';
export { CollapsibleGroup };
