import styled from 'styled-components';

export const HeaderControlButtonBase = styled.button<{ $folded: boolean }>`
  width: ${p => (p.$folded ? 16 : 20)}px;
  height: ${p => (p.$folded ? 16 : 20)}px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;
  }
`;
