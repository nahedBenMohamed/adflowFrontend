import styled from 'styled-components';

const BoardList = styled.ul`
  display: flex;
  flex-direction: column;

  &:hover {
    .workspace__BoardItemPrimary--Root {
      margin-left: 0;
    }

    .workspace__BoardItemPrimary--DraggableIconWrapper {
      opacity: 1;
    }
  }
`;

export { BoardList };
