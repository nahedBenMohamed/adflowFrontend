import styled from 'styled-components';

export const ColumnCountGhost = styled.div<{ $medium?: boolean }>`
  visibility: hidden;

  height: 20px;
  width: ${p => (p.$medium ? '24px' : '32px')};

  border-radius: var(--border-radius-element);
`;
