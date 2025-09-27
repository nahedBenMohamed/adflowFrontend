import { ActionsIcon } from '@/shared';
import { memo } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  padding-right: 10px;
`;

const TaskActionHeaderCell = memo(() => {
  return (
    <Root>
      <ActionsIcon />
    </Root>
  );
});

TaskActionHeaderCell.displayName = 'TaskActionHeaderCell';
export { TaskActionHeaderCell };
