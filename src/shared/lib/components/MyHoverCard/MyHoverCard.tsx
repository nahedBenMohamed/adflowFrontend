import type { FloatingPosition, PopoverWidth } from '@mantine/core';
import { HoverCard, type MantineTransition } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import type { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';

interface DropdownProps {
  $maxWidth?: number;
  $backgroundColor?: string;
  $overflowHidden?: boolean;
}

const StyledDropdown = styled(HoverCard.Dropdown)<DropdownProps>`
  padding: 0;

  z-index: var(--dropdown-z-index);

  max-width: ${p => p.$maxWidth}px;

  box-shadow: var(--dropdown-box-shadow);
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  overflow: ${p => p.$overflowHidden && 'hidden'};
  background-color: ${p =>
    p.$backgroundColor ? p.$backgroundColor : 'var(--primary-statuses-white-0)'};
`;

interface Props {
  target: ReactNode;
  children: ReactNode;
  offset?: number;
  withArrow?: boolean;
  position?: FloatingPosition;
  withinPortal?: boolean;
  width?: PopoverWidth;
  transition?: MantineTransition;
  exitDuration?: number;
  transitionDuration?: number;
  openDelay?: number;
  closeDelay?: number;
  maxWidth?: number;
  backgroundColor?: string;
  zIndex?: CSSProperties['zIndex'];
  onOpen?: () => void;
  onClose?: () => void;
}

const MyHoverCard = observer((props: Props) => {
  const {
    target,
    children,
    withArrow,
    transition,
    exitDuration,
    transitionDuration,
    maxWidth,
    backgroundColor,
    zIndex = 'var(--dropdown-z-index)',
    ...rest
  } = props;

  return (
    <HoverCard
      zIndex={zIndex}
      withArrow={withArrow}
      transitionProps={{
        duration: transitionDuration ?? 200,
        timingFunction: 'ease',
        transition,
        exitDuration,
      }}
      styles={{
        arrow: {
          border: 'none',
        },
      }}
      {...rest}
    >
      <HoverCard.Target>{target}</HoverCard.Target>

      <StyledDropdown
        $overflowHidden={!withArrow}
        $maxWidth={maxWidth}
        $backgroundColor={backgroundColor}
      >
        {children}
      </StyledDropdown>
    </HoverCard>
  );
});

MyHoverCard.displayName = 'MyHoverCard';
export { MyHoverCard };
