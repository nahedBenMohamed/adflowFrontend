import type { FloatingPosition } from '@mantine/core';
import { Popover } from '@mantine/core';
import { RefObject, useRef, type CSSProperties, type ReactNode } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';

const Root = styled.div<{ $width: CSSProperties['width'] }>`
  width: ${p => p.$width};
`;

interface PopoverDropdownProps {
  $maxWidth?: number;
  $borderRadius?: number;
  $backgroundColor?: string;
  $overflowHidden?: boolean;
}

const StyledPopoverDropdown = styled(Popover.Dropdown)<PopoverDropdownProps>`
  padding: 0;

  max-width: ${p => p.$maxWidth}px;

  z-index: var(--dropdown-z-index);
  box-shadow: var(--dropdown-box-shadow);
  border: 1px solid var(--graphite-graphite-80);
  overflow: ${p => p.$overflowHidden && 'hidden'};
  border-radius: ${p => p.$borderRadius ?? 'var(--border-radius-block)'};
  background-color: ${p => p.$backgroundColor ?? 'var(--primary-statuses-white-0)'};
`;

export interface MyPopoverProps {
  Target: ReactNode;
  children: ReactNode;
  opened?: boolean;
  maxWidth?: number;
  inModal?: boolean;
  withArrow?: boolean;
  borderRadius?: number;
  returnFocus?: boolean;
  withinPortal?: boolean;
  backgroundColor?: string;
  position?: FloatingPosition;
  width?: CSSProperties['width'];
  exitTransitionDuration?: number;
  rootWidth?: CSSProperties['width'];
  hide?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

const MyPopover = (props: MyPopoverProps) => {
  const {
    Target,
    children,
    opened,
    width,
    inModal,
    maxWidth,
    position,
    withArrow,
    rootWidth,
    returnFocus,
    withinPortal,
    borderRadius,
    backgroundColor,
    exitTransitionDuration,
    hide,
    onOpen,
    onClose,
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(rootRef as RefObject<HTMLDivElement>, e => {
    const target = e.target as HTMLElement;

    if (inModal) {
      if (target.closest('.workspace__MyPopover--StyledDropdown')) return;

      hide?.();
    } else {
      if (
        target.closest('.workspace__MyPopover--StyledDropdown') ||
        target.closest('.workspace__OverlayingModal--Overlay') ||
        target.closest('.workspace__OverlayingModal--Content')
      )
        return;

      hide?.();
    }
  });

  return (
    <Root ref={rootRef} $width={rootWidth}>
      <Popover
        width={width}
        opened={opened}
        position={position}
        withArrow={withArrow}
        returnFocus={returnFocus}
        withinPortal={withinPortal}
        zIndex="var(--dropdown-z-index)"
        transitionProps={{ exitDuration: exitTransitionDuration }}
        styles={{
          arrow: {
            border: 'none',
          },
        }}
        onOpen={onOpen}
        onClose={onClose}
      >
        <Popover.Target>{Target}</Popover.Target>

        <StyledPopoverDropdown
          $maxWidth={maxWidth}
          $overflowHidden={!withArrow}
          $borderRadius={borderRadius}
          $backgroundColor={backgroundColor}
          className="workspace__MyPopover--StyledDropdown"
        >
          {children}
        </StyledPopoverDropdown>
      </Popover>
    </Root>
  );
};

export { MyPopover };
