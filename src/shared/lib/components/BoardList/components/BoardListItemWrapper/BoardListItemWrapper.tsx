import styled from 'styled-components';

interface BoardListItemWrapperProps {
  $margin?: boolean;
  $noPadding?: boolean;
}

const BoardListItemWrapper = styled.div<BoardListItemWrapperProps>`
  padding: ${p => (p.$noPadding ? 0 : '0 8px')};

  ${p => p.$margin && `margin-bottom: 4px`};
`;

export { BoardListItemWrapper };
