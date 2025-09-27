import styled, { css } from 'styled-components';

interface BaseTableRootProps {
  $loading?: boolean;
  $disabled?: boolean;
}

export const BaseTableRoot = styled.div<BaseTableRootProps>`
  position: relative;

  width: 100%;

  transition: var(--transition-200);

  ${p =>
    p.$loading &&
    css`
      cursor: wait;

      opacity: 0.65;
    `}

  ${p => p.$disabled && `pointer-events: none`};
`;
