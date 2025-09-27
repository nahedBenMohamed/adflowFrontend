import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import type { SelectModel } from '../../../../../../../../../../shared';
import {
  AmountCellRoot,
  TaxStrategy,
  type RentalOrderItemRow,
} from '../../../../../../../../shared';

interface Props {
  numberOfDays: number;
  taxStrategy: SelectModel;
  currentWarehouse: SelectModel;
  cellInfo: CellContext<RentalOrderItemRow, unknown>;
}

const CardRentalOrderAmountCell = observer((props: Props) => {
  const { numberOfDays, taxStrategy, currentWarehouse, cellInfo } = props;

  const { price, tax, discount, getAmount } = cellInfo.row.original;

  const taxIncluded = taxStrategy.value === TaxStrategy.INCLUDED;
  const currentWarehouseId = currentWarehouse.value ? (currentWarehouse.value as number) : null;

  const [amount, setAmount] = useState<number>(() => getAmount(taxIncluded, numberOfDays));

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setAmount(getAmount(taxIncluded, numberOfDays));
  }, [
    price.value,
    tax.value,
    taxStrategy.value,
    taxIncluded,
    discount.value,
    currentWarehouseId,
    numberOfDays,
    getAmount,
  ]);

  return <AmountCellRoot amount={amount} />;
});

CardRentalOrderAmountCell.displayName = 'CardRentalOrderAmountCell';
export { CardRentalOrderAmountCell };
