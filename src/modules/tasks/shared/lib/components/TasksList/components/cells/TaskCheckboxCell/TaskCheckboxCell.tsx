import { MyCheckbox } from '@/shared';
import { type CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { type TaskRow } from '../../../../../models';

interface Props {
  cellContext: CellContext<TaskRow, unknown>;
  getToggleResolveHandler: (taskRow: TaskRow) => () => void;
}

const TaskCheckboxCell = observer((props: Props) => {
  const { cellContext, getToggleResolveHandler } = props;

  const originalRow = cellContext.row.original;
  const {
    isResolved,
    originalTask: {
      userRights: { canEdit },
    },
  } = originalRow;

  return (
    <MyCheckbox
      gray={isResolved}
      disabled={!canEdit}
      checked={isResolved}
      onChange={getToggleResolveHandler(originalRow)}
    />
  );
});

TaskCheckboxCell.displayName = 'TaskCheckboxCell';
export { TaskCheckboxCell };
