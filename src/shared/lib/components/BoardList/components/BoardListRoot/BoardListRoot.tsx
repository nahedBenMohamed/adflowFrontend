import styled, { type CSSProperties } from 'styled-components';
import { DropdownScrollbarMixin } from '../../../../mixins';

interface BoardListRootProps {
  $noGap?: boolean;
  $noPadding?: boolean;
  $maxHeight?: CSSProperties['maxHeight'];
}

export const BoardListRoot = styled.ul<BoardListRootProps>`
  max-height: ${p => p.$maxHeight};
  min-width: 144px;
  max-width: 400px;

  display: flex;
  flex-direction: column;
  gap: ${p => (p.$noGap ? 0 : `4px`)};

  ${DropdownScrollbarMixin}

  padding: ${p => (p.$noPadding ? 0 : '8px 0 12px')};
`;
