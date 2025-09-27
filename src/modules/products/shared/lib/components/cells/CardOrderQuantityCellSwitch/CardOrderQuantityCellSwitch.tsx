import type { InputModel } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { orderStatusStore, type OrderStore, type WarehouseStore } from '../../../../../store';
import { OrderStatusCode, ProductsSectionType, type OrderItemRow } from '../../../models';
import { QuantityCell } from '../QuantityCell/QuantityCell';
import { QuantityCellWithModal } from '../QuantityCellWithModal/QuantityCellWithModal';
import { ReservationQuantityCell } from '../ReservationQuantityCell/ReservationQuantityCell';

interface Props {
  orderStore: OrderStore;
  warehouseStore: WarehouseStore;
  reservedOrNotInitialized: boolean;
  cellContext: CellContext<OrderItemRow, InputModel>;
}

const CardOrderQuantityCellSwitch = observer((props: Props) => {
  const { orderStore, warehouseStore, reservedOrNotInitialized, cellContext } = props;

  const orderItemRow = cellContext.row.original;

  const { product, quantity, initialReservations, getQuantity } = orderItemRow;

  if (!reservedOrNotInitialized)
    return <ReservationQuantityCell maxQuantity={null} disabled model={quantity} />;

  if (!orderStore.warehousesEnabled)
    return <QuantityCell model={quantity} maxQuantity={null} orderStore={orderStore} />;

  const statusId = orderStore.order?.statusId;
  const currentStatusCode = statusId ? orderStatusStore.getById(statusId).code : undefined;

  const currentWarehouseId = orderStore.currentWarehouse.value;

  // warehouse selected or  service
  if (currentWarehouseId || product.isService()) {
    const maxQuantity = product.isService()
      ? null
      : currentStatusCode
        ? currentStatusCode === OrderStatusCode.RESERVED
          ? product.getAvailable(currentWarehouseId) +
            (initialReservations?.find(r => r.warehouseId === currentWarehouseId)?.quantity ?? 0)
          : Number.MAX_SAFE_INTEGER
        : product.getAvailable(currentWarehouseId);

    // Number.MAX_SAFE_INTEGER -> that's because we don't want to allow to change stocks when status is initialized
    // and not RESERVED, so max quantity is needless and don't influence on the form validation

    if (maxQuantity) quantity.max(maxQuantity);

    return (
      <QuantityCell
        model={quantity}
        orderStore={orderStore}
        maxQuantity={maxQuantity}
        saveReservations={reservations =>
          orderStore.saveOrderItemRowReservations(orderItemRow.id, reservations)
        }
      />
    );
  }

  // multiple warehouses, multiple stocks
  return (
    <QuantityCellWithModal
      row={orderItemRow}
      warehouseStore={warehouseStore}
      currentStatusCode={currentStatusCode}
      sectionType={ProductsSectionType.SALE}
      getQuantity={() => getQuantity({ warehousesEnabled: true })}
      saveReservations={reservations =>
        orderStore.saveOrderItemRowReservations(orderItemRow.id, reservations)
      }
    />
  );
});

CardOrderQuantityCellSwitch.displayName = 'CardOrderQuantityCellSwitch';
export { CardOrderQuantityCellSwitch };
