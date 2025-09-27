import styled, { css } from 'styled-components';

const SwipeableContainer = styled.div<{ $tracked: boolean }>`
  ${p =>
    p.$tracked &&
    css`
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    `}
`;

export { SwipeableContainer };
