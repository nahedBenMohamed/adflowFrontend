import { memo } from 'react';
import styled from 'styled-components';
import { ActionsIcon } from '../../../assets';

const Root = styled.div`
  width: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ActionsHeaderCell = memo(() => {
  return (
    <Root>
      <ActionsIcon />
    </Root>
  );
});

ActionsHeaderCell.displayName = 'ActionsHeaderCell';
export { ActionsHeaderCell };
