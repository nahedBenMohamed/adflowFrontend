import type { CellContext } from '@tanstack/react-table';
import { StockCell, type ShipmentItemRow } from '../../../../../../../shared';

interface Props {
  cellInfo: CellContext<ShipmentItemRow, unknown>;
  currentWarehouseId: number;
}

const ShipmentAvailableCell = (props: Props) => {
  const { cellInfo, currentWarehouseId } = props;

  const product = cellInfo.row.original.product;
  const available = product.stocks.find(s => s.warehouseId === currentWarehouseId)?.available;

  return available ? <StockCell stock={available} color="green" /> : null;
};

export { ShipmentAvailableCell };
