import { memo, type HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { ClearSelectIcon } from '../../../../../../assets';

type HoverState = 'red' | 'semitransparent';

const Root = styled.button<{ $hoverState?: HoverState }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    ${p =>
      p.$hoverState === 'semitransparent'
        ? `opacity: 0.7`
        : css`
            svg path {
              fill: var(--primary-statuses-red-360);
            }
          `}
  }
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  hoverState?: HoverState;
}

export const CLEAR_BUTTON_CLASS = 'workspace__ClearButton--Root';

const ClearButton = memo((props: Props) => {
  const { hoverState = 'red', ...rest } = props;

  return (
    <Root type="button" className={CLEAR_BUTTON_CLASS} $hoverState={hoverState} {...rest}>
      <ClearSelectIcon />
    </Root>
  );
});

ClearButton.displayName = 'ClearButton';
export { ClearButton };
