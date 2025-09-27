import type { FloatingPosition } from '@mantine/core';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { InfoSmallIcon } from '../../../assets';
import { MyTooltip } from '../MyTooltip/MyTooltip/MyTooltip';

interface IconWrapperProps {
  $as: HintAs;
  $size?: HintSize;
}

const IconWrapper = styled.div<IconWrapperProps>`
  width: ${p => (p.$size === 'small' ? 12 : 20)}px;
  height: ${p => (p.$size === 'small' ? 12 : 20)}px;

  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  display: ${p => (p.$as === 'span' ? 'inline-flex' : 'flex')};

  svg {
    width: ${p => (p.$size === 'small' ? 12 : 16)}px;
    height: ${p => (p.$size === 'small' ? 12 : 16)}px;
  }

  svg path,
  svg rect {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path,
    svg rect {
      fill: var(--button-text-graphite-primary-text);
    }
  }
`;

interface Props {
  text: ReactNode;
  size?: HintSize;
  position?: FloatingPosition;
  maxWidth?: number;
  as?: HintAs;
}

type HintAs = 'div' | 'span';
type HintSize = 'small' | 'big';

const Hint = (props: Props) => {
  const { text, size = 'small', position = 'top', maxWidth = 320, as = 'div' } = props;

  return (
    <MyTooltip withinPortal multiline label={text} maxWidth={maxWidth} position={position}>
      <IconWrapper $as={as} $size={size}>
        <InfoSmallIcon />
      </IconWrapper>
    </MyTooltip>
  );
};

export { Hint };
