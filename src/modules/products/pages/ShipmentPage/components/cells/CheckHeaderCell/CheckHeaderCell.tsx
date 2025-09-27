import { MyCheckbox } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { RentalShipmentStore, ShipmentStore } from '../../../../../store';

interface Props {
  shipmentStore: RentalShipmentStore | ShipmentStore;
}

const CheckHeaderCell = observer((props: Props) => {
  const { shipmentStore } = props;

  const { allRowsChecked, someRowsChecked, toggleCheckAllRows } = shipmentStore;

  return (
    <MyCheckbox
      variant="mark"
      checked={allRowsChecked}
      indeterminate={someRowsChecked}
      onChange={toggleCheckAllRows}
    />
  );
});

CheckHeaderCell.displayName = 'CheckHeaderCell';
export { CheckHeaderCell };
