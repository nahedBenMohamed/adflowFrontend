import { AmountCellRoot } from '@/modules/products';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import type { ScheduleAppointmentOrderItemRow } from '../../../../../models';

interface Props {
  orderItemRow: ScheduleAppointmentOrderItemRow;
}

const AppointmentServiceAmountCell = observer((props: Props) => {
  const { orderItemRow } = props;

  const { price, discount, quantity, getAmount } = orderItemRow;

  const [amount, setAmount] = useState(() => getAmount());

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setAmount(getAmount());
  }, [price.value, discount.value, quantity.value, getAmount]);

  return <AmountCellRoot amount={amount} />;
});

AppointmentServiceAmountCell.displayName = 'AppointmentServiceAmountCell';
export { AppointmentServiceAmountCell };
