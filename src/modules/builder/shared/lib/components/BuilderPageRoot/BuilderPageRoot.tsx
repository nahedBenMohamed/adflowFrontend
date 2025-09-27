import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';

interface BuilderPageRootProps {
  $loading?: boolean;
  $padding?: CSSProperties['padding'];
}

const BuilderPageRoot = styled.div<BuilderPageRootProps>`
  padding: ${p => p.$padding ?? '16px'};
  transition: var(--transition-200);

  ${p =>
    p.$loading &&
    css`
      cursor: wait;

      opacity: 0.65;

      * {
        pointer-events: none;
      }
    `}
`;

export { BuilderPageRoot };
