import { SpanWithEllipsis } from '@/shared';
import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { memo, useCallback, type MouseEventHandler, type ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { FramelessCaretIcon } from '../../../../../../../../shared';
import { TitleWrapperSwitch } from '../../../TitleWrapperSwitch/TitleWrapperSwitch';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  background-color: var(--primary-statuses-white-0);
`;

const Title = styled.div`
  width: 100%;
  max-width: 100%;

  display: flex;
  align-items: center;
  gap: 6px;
`;

interface IconWrapperProps {
  $active: boolean;
  $disabled?: boolean;
}

const IconWrapper = styled.div<IconWrapperProps>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: rotate(${p => (p.$active ? 180 : 90)}deg);
  transition: var(--transition-200);

  ${p =>
    p.$disabled &&
    css`
      opacity: 0.3;

      transform: rotate(90deg);
    `}
`;

const Content = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 4px;
`;

interface Props {
  title: string;
  children: ReactNode;
  value?: string;
  disabled?: boolean;
  defaultExpanded?: boolean;
}

const CollapsibleTab = memo((props: Props) => {
  const { defaultExpanded, title, value, children, disabled } = props;

  const [collapsed, { toggle }] = useDisclosure(defaultExpanded);

  const handleToggle = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      e.stopPropagation();

      toggle();
    },
    [toggle]
  );

  return (
    <Root>
      <TitleWrapperSwitch value={value} handleToggle={handleToggle}>
        <Title>
          <IconWrapper $active={collapsed} $disabled={disabled} onClick={handleToggle}>
            <FramelessCaretIcon />
          </IconWrapper>

          <SpanWithEllipsis text={title} />
        </Title>
      </TitleWrapperSwitch>

      <Collapse in={collapsed}>
        <Content>{children}</Content>
      </Collapse>
    </Root>
  );
});

CollapsibleTab.displayName = 'CollapsibleTab';
export { CollapsibleTab };
