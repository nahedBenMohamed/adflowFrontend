import type { ArrowPosition, FloatingPosition } from '@mantine/core';
import { Tooltip, type TooltipProps } from '@mantine/core';
import type { CSSProperties, ReactNode } from 'react';

interface Props {
  label: ReactNode;
  children: ReactNode;
  withArrow?: boolean;
  arrowPosition?: ArrowPosition;
  arrowSize?: number;
  withinPortal?: boolean;
  position?: FloatingPosition;
  openDelay?: number;
  backgroundColor?: CSSProperties['backgroundColor'];
  zIndex?: CSSProperties['zIndex'];
  padding?: CSSProperties['padding'];
  offset?: number;
  disabled?: boolean;
  multiline?: boolean;
  maxWidth?: number;
}

const TOOLTIP_EVENTS: TooltipProps['events'] = {
  hover: true,
  focus: true,
  touch: true,
};

const MyTooltip = (props: Props) => {
  const {
    label,
    children,
    withArrow = true,
    arrowPosition,
    arrowSize = 6,
    withinPortal,
    position,
    openDelay,
    backgroundColor,
    zIndex,
    padding,
    offset,
    disabled,
    multiline = false,
    maxWidth,
  } = props;

  return (
    <Tooltip
      offset={offset}
      disabled={!label || disabled}
      withinPortal={withinPortal}
      position={position}
      label={label}
      zIndex={zIndex ?? 'var(--dropdown-z-index)'}
      withArrow={withArrow}
      arrowPosition={arrowPosition}
      arrowSize={arrowSize}
      openDelay={openDelay}
      events={TOOLTIP_EVENTS}
      multiline={multiline}
      styles={{
        tooltip: {
          fontWeight: 400,
          maxWidth: `${maxWidth}px`,
          padding: padding ?? '4px 8px',
          backgroundColor: backgroundColor ?? 'var(--button-text-graphite-primary-text)',
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export { MyTooltip };
