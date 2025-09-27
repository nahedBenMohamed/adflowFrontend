import { Indicator } from '@mantine/core';
import type { IndicatorPosition } from '@mantine/core/lib/components/Indicator/Indicator.types';
import type { ReactNode } from 'react';
import styled, { keyframes, type CSSProperties, type Keyframes } from 'styled-components';

const getPulsingAnimation = (color: string): Keyframes => keyframes`
  0% {
    box-shadow: 0 0 0 0px ${color};
  }

  50% {
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0);
  }

  100% {
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
  }
`;

interface StyledIndicatorProps {
  $color: string;
  $isVisible?: boolean;
  $rootWidth?: CSSProperties['width'];
  $rootHeight?: CSSProperties['height'];
}

const StyledIndicator = styled(Indicator)<StyledIndicatorProps>`
  width: ${p => p.$rootWidth};
  height: ${p => p.$rootHeight};

  display: flex;

  svg {
    display: ${p => !p.$isVisible && 'none'};
  }

  // normalize indicator z-index, because by default it is > 100 (has layout issues)
  .mantine-Indicator-indicator {
    z-index: auto !important;
  }

  .mantine-Indicator-processing {
    animation: ${p => getPulsingAnimation(p.$color)} 1.5s infinite;
  }
`;

interface Props {
  size: CSSProperties['width'];
  children: ReactNode;
  rootWidth?: CSSProperties['width'];
  rootHeight?: CSSProperties['height'];
  withBorder?: boolean;
  disabled?: boolean;
  offset?: number;
  zIndex?: number;
  label?: ReactNode;
  position?: IndicatorPosition;
  isVisible?: boolean;
  color?: string;
  processing?: boolean;
}

const MyIndicator = (props: Props) => {
  const {
    size,
    children,
    rootHeight,
    rootWidth,
    withBorder,
    disabled,
    offset,
    zIndex,
    label,
    position,
    isVisible = true,
    color = 'var(--button-text-green-active)',
    processing,
  } = props;

  return (
    <StyledIndicator
      size={size}
      label={label}
      color={color}
      $color={color}
      zIndex={zIndex}
      offset={offset}
      disabled={disabled}
      position={position}
      $isVisible={isVisible}
      $rootWidth={rootWidth}
      processing={processing}
      withBorder={withBorder}
      $rootHeight={rootHeight}
    >
      {children}
    </StyledIndicator>
  );
};

export { MyIndicator };
