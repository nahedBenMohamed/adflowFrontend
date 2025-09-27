import { useCallback, type CSSProperties } from 'react';
import styled from 'styled-components';
import { CheckIcon } from '../../../assets';
import { ColorUtil } from '../../utils';

interface RootProps {
  $color: CSSProperties['color'];
  $active?: boolean;
}

const Root = styled.button<RootProps>`
  width: 28px;
  height: 28px;

  display: flex;
  justify-content: center;
  align-items: center;

  outline-offset: 2px;
  background: ${p => p.$color};
  border-radius: var(--border-radius-element);
  outline: 1px solid transparent;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    outline: 1px solid var(--button-text-graphite-priory-text);
  }

  ${p => p.$active && 'outline: 1px solid var(--button-text-graphite-priory-text)'};
`;

const IconWrapper = styled.div<{ $color: CSSProperties['color'] }>`
  width: 16px;
  height: 16px;

  flex-shrink: 0;

  svg path {
    fill: ${p => p.$color};
  }
`;

interface Props {
  color: string;
  active?: boolean;
  onClick: (color: string) => void;
}

const ColorBox = (props: Props) => {
  const { color, active, onClick } = props;

  const checkColor = ColorUtil.getTextContrastColorByBgColorHex(color ?? null);

  const handleClick = useCallback(() => onClick(color), [color, onClick]);

  return (
    <Root type="button" $color={color} $active={active} onClick={handleClick}>
      {active && (
        <IconWrapper $color={checkColor}>
          <CheckIcon />
        </IconWrapper>
      )}
    </Root>
  );
};

export { ColorBox };
