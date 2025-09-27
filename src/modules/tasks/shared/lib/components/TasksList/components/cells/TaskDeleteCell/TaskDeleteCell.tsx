import { DeleteButton } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { TaskRow } from '../../../../../models';

const Root = styled.div`
  padding-right: 8px;

  .workspace__DeleteButton--Root {
    scale: 0;
    opacity: 0;
  }
`;

interface Props {
  cellContext: CellContext<TaskRow, unknown>;
  onDelete: () => void;
}

const TaskDeleteCell = observer((props: Props) => {
  const { cellContext, onDelete } = props;

  const {
    originalTask: {
      userRights: { canDelete },
    },
  } = cellContext.row.original;

  return (
    canDelete && (
      <Root>
        <DeleteButton onClick={onDelete} />
      </Root>
    )
  );
});

TaskDeleteCell.displayName = 'TaskDeleteCell';
export { TaskDeleteCell };
