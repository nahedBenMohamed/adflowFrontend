import type { Nullable, SelectModel } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { AmountCellRoot, TaxStrategy, type OrderItemRow } from '../../../../../../../../../shared';
import { orderStatusStore } from '../../../../../../../../../store';

interface Props {
  cellInfo: CellContext<OrderItemRow, unknown>;
  taxStrategy: SelectModel;
  currentWarehouse: SelectModel;
  warehousesEnabled: boolean;
  statusId?: Nullable<number>;
}

const CardOrderAmountCell = observer((props: Props) => {
  const { cellInfo, taxStrategy, currentWarehouse, warehousesEnabled, statusId } = props;

  const { price, tax, reservations, discount, quantity, getAmount } = cellInfo.row.original;

  const taxIncluded = taxStrategy.value === TaxStrategy.INCLUDED;
  const currentWarehouseId = currentWarehouse.value ? (currentWarehouse.value as number) : null;

  const statusCode = statusId ? orderStatusStore.getById(statusId).code : undefined;

  const [amount, setAmount] = useState<number>(() =>
    getAmount({ taxIncluded, warehousesEnabled, currentWarehouseId, statusCode })
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setAmount(getAmount({ taxIncluded, warehousesEnabled, currentWarehouseId, statusCode }));
  }, [
    tax.value,
    statusCode,
    price.value,
    taxIncluded,
    reservations,
    discount.value,
    quantity.value,
    taxStrategy.value,
    warehousesEnabled,
    currentWarehouseId,
    getAmount,
  ]);

  return <AmountCellRoot amount={amount} />;
});

CardOrderAmountCell.displayName = 'CardOrderAmountCell';
export { CardOrderAmountCell };
