import { useModalControl } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled, { css } from 'styled-components';
import type { WarehouseStore } from '../../../../../store';
import {
  OrderItemRow,
  type OrderStatusCode,
  type ProductRow,
  type ProductsSectionType,
  type Reservation,
} from '../../../models';
import { QuantityControlButton } from '../../QuantityControlButton/QuantityControlButton';
import { ReservationsModal } from '../../ReservationsModal/ReservationsModal';

const Root = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    cursor: pointer;
  }
`;

const Block = styled.div<{ $invalid: boolean }>`
  height: 26px;

  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);

  border: 1px solid var(--button-text-graphite-secondary-text);
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    border-color: var(--button-text-graphite-primary-text);
  }

  ${p =>
    p.$invalid &&
    css`
      border-color: var(--button-text-red-hover);

      &:hover {
        border-color: var(--button-text-red-hover);
      }
    `}
`;

interface Props {
  row: ProductRow | OrderItemRow;
  warehouseStore: WarehouseStore;
  sectionType: ProductsSectionType;
  currentStatusCode?: OrderStatusCode;
  getQuantity: () => number;
  saveReservations: (reservations: Reservation[]) => void;
}

const QuantityCellWithModal = observer((props: Props) => {
  const { row, warehouseStore, sectionType, currentStatusCode, getQuantity, saveReservations } =
    props;

  const { product, reservations } = row;

  const reservationsModal = useModalControl(false);

  const quantity = getQuantity();

  return (
    <>
      <Root onClick={reservationsModal.open}>
        <QuantityControlButton type="decrement" disabled={quantity <= 1} />

        <Block $invalid={quantity < 1}>{quantity}</Block>

        <QuantityControlButton type="increment" />
      </Root>

      {reservationsModal.opened && (
        <ReservationsModal
          product={product}
          sectionType={sectionType}
          reservations={reservations}
          warehouseStore={warehouseStore}
          opened={reservationsModal.opened}
          currentStatusCode={currentStatusCode}
          initialReservations={row instanceof OrderItemRow ? row.initialReservations : undefined}
          hide={reservationsModal.close}
          saveReservations={saveReservations}
        />
      )}
    </>
  );
});

QuantityCellWithModal.displayName = 'QuantityCellWithModal';
export { QuantityCellWithModal };
