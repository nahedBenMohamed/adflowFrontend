import { observer } from 'mobx-react-lite';
import { MyCheckbox } from '../../../../../../../shared';
import type { RentalShipmentItemRow, ShipmentItemRow } from '../../../../../shared';
import type { RentalShipmentStore, ShipmentStore } from '../../../../../store';

interface Props {
  orderItem: RentalShipmentItemRow | ShipmentItemRow;
  shipmentStore: RentalShipmentStore | ShipmentStore;
}

const CheckRowCell = observer((props: Props) => {
  const { orderItem, shipmentStore } = props;

  return (
    <MyCheckbox
      variant="mark"
      checked={orderItem.checked}
      onChange={() => shipmentStore.toggleCheckRow(orderItem.product.id)}
    />
  );
});

CheckRowCell.displayName = 'CheckRowCell';
export { CheckRowCell };
