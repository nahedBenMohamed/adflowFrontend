import type { InputModel, Nullable } from '@/shared';
import { useDidUpdate } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import type { OrderStore } from '../../../../../store';
import { Reservation } from '../../../models';
import { ReservationQuantityCell } from '../ReservationQuantityCell/ReservationQuantityCell';

interface Props {
  model: InputModel;
  orderStore: OrderStore;
  maxQuantity: Nullable<number>;
  filterWarehouseId?: Nullable<number>;
  saveReservations?: (reservations: Reservation[]) => void;
}

const QuantityCell = observer((props: Props) => {
  const { model, maxQuantity, orderStore, filterWarehouseId, saveReservations } = props;

  useDidUpdate(() => {
    let warehouseId;

    if (orderStore.getCurrentWarehouseId()) {
      warehouseId = orderStore.getCurrentWarehouseId();
    } else if (filterWarehouseId) {
      warehouseId = filterWarehouseId;
    }

    if (!warehouseId) return;

    saveReservations?.([new Reservation({ warehouseId, quantity: model.asNumber() })]);
  }, [model.value, model, orderStore, filterWarehouseId]);

  return <ReservationQuantityCell model={model} maxQuantity={maxQuantity} />;
});

QuantityCell.displayName = 'QuantityCell';
export { QuantityCell };
