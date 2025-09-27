import { memo, type ReactNode } from 'react';
import styled, { css } from 'styled-components';
import {
  DashedFrameLargeIcon,
  DashedFrameMediumIcon,
  SolidFrameLargeIcon,
  SolidFrameMediumIcon,
} from '../../../../../assets';

const FrameIconWrapper = styled.div<{ $size: ButtonSize }>`
  position: absolute;
  top: 0;
  left: 0;

  width: ${p => (p.$size === 'medium' ? '32px' : '36px')};
  height: ${p => (p.$size === 'medium' ? '32px' : '36px')};

  flex-shrink: 0;
`;

interface RootProps {
  $outlined: boolean;
  $active: boolean;
  $size: ButtonSize;
  $error?: boolean;
}

const Root = styled.div<RootProps>`
  position: relative;

  ${p =>
    p.$outlined &&
    css`
      height: ${p.$size === 'medium' ? '32px' : '36px'};
      width: ${p.$size === 'medium' ? '32px' : '36px'};
      min-width: ${p.$size === 'medium' ? '32px' : '36px'};
    `}

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  text-align: center;

  ${p =>
    p.$error &&
    css`
      svg {
        rect:not(:first-child),
        circle,
        ellipse,
        path {
          fill: var(--button-text-red-hover);
        }
      }
    `}

  ${p =>
    p.$active &&
    css`
      svg {
        rect:not(:first-child),
        circle,
        ellipse,
        path {
          fill: var(--button-text-graphite-primary-text);
        }
      }
    `}
`;

export type ButtonSize = 'medium' | 'large';

interface Props {
  children: ReactNode;
  active?: boolean;
  outlined?: boolean;
  size?: ButtonSize;
  error?: boolean;
}

const RoundedDashedFrame = memo((props: Props) => {
  const { children, active = false, outlined = true, size = 'medium', error } = props;

  return (
    <Root $active={active} $outlined={outlined} $size={size} $error={error}>
      {outlined && (
        <FrameIconWrapper $size={size} className="rounded_icon">
          {size === 'medium' && (active ? <SolidFrameMediumIcon /> : <DashedFrameMediumIcon />)}
          {size === 'large' && (active ? <SolidFrameLargeIcon /> : <DashedFrameLargeIcon />)}
        </FrameIconWrapper>
      )}

      {children}
    </Root>
  );
});

RoundedDashedFrame.displayName = 'RoundedDashedFrame';
export { RoundedDashedFrame };
