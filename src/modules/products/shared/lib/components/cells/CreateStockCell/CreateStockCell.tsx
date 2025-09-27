import { MyInput, type InputModel } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import type { CreateStockRow } from '../../../models';

interface Props {
  cellInfo: CellContext<CreateStockRow, InputModel>;
}

const CreateStockCell = observer((props: Props) => {
  const { cellInfo } = props;

  const model = cellInfo.getValue();

  return <MyInput variant="outlined" model={model} />;
});

CreateStockCell.displayName = 'CreateStockCell';
export { CreateStockCell };
