import type { ComponentProps, CSSProperties } from 'react';
import styled from 'styled-components';
import { HorizontalDotsIcon } from '../../../../../assets';
import { ColorUtil } from '../../../../utils';

const Root = styled.button<{ $active?: boolean }>`
  width: 28px;
  height: 28px;

  display: flex;
  justify-content: center;
  align-items: center;

  outline-offset: 2px;
  outline: 1px solid transparent;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  &:hover {
    cursor: pointer;

    outline: 1px solid var(--button-text-graphite-priory-text);
  }

  ${p => p.$active && 'outline: 1px solid var(--button-text-graphite-priory-text)'};
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg rect {
    fill: ${p => p.$color};
  }
`;

interface Props extends ComponentProps<'button'> {
  color?: string;
  active?: boolean;
}

const MyColorPickerDefaultButton = (props: Props) => {
  const { ref, color, active, ...rest } = props;

  const checkColor = color
    ? ColorUtil.getTextContrastColorByBgColorHex(color)
    : 'var(--button-text-green-default)';

  const rootStyles = {
    background: color,
    border: color ? 'none' : '1px solid var(--graphite-graphite-80)',
  } satisfies CSSProperties;

  return (
    <Root ref={ref} type="button" style={rootStyles} $active={active} {...rest}>
      <IconWrapper $color={checkColor}>
        <HorizontalDotsIcon />
      </IconWrapper>
    </Root>
  );
};

export { MyColorPickerDefaultButton };
