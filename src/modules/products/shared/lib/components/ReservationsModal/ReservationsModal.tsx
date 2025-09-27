import { DialogModalSecondary, validateForm } from '@/shared';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { WarehouseStore } from '../../../../store';
import { useReservationsColumns } from '../../hooks';
import {
  OrderStatusCode,
  ReservationRow,
  type Product,
  type ProductsSectionType,
  type Reservation,
} from '../../models';
import { AddStockPlaceholder, ReservationsTable } from './components';

const Root = styled.div`
  width: 100%;

  padding: 0 16px;
`;

const AddStockPlaceholderWrapper = styled.div`
  padding: 16px;
`;

interface Props {
  product: Product;
  reservations: Reservation[];
  opened: boolean;
  warehouseStore: WarehouseStore;
  sectionType: ProductsSectionType;
  currentStatusCode?: OrderStatusCode;
  initialReservations?: Reservation[];
  saveReservations: (reservations: Reservation[]) => void;
  hide: () => void;
}

const ReservationsModal = observer((props: Props) => {
  const {
    product,
    reservations,
    opened,
    warehouseStore,
    sectionType,
    currentStatusCode,
    initialReservations,
    saveReservations,
    hide,
  } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common',
  });

  const { activeWarehouses } = warehouseStore;

  const [reservationRows, setReservationRows] = useState<ReservationRow[]>([]);

  useLayoutEffect(() => {
    if (activeWarehouses && activeWarehouses.length > 0)
      setReservationRows(
        product.stocks.map<ReservationRow>(s => {
          const warehouse = activeWarehouses.find(w => w.id === s.warehouseId);

          if (!warehouse) throw new Error(`Warehouse with id ${s.warehouseId} not found`);

          const reservedQuantity =
            reservations.find(r => r.warehouseId === warehouse.id)?.quantity ?? 0;

          const initialReservedQuantity =
            initialReservations?.find(r => r.warehouseId === warehouse.id)?.quantity ??
            reservedQuantity;

          // Number.MAX_SAFE_INTEGER -> that's because we don't want to allow to change stocks when status is initialized
          // and not RESERVED, so max quantity is needless and don't influence on the form validation
          return ReservationRow.create({
            stock: s,
            quantity: reservedQuantity,
            warehouseName: warehouse.name,
            warehouseUserRights: warehouse.userRights,
            maxQuantity: currentStatusCode
              ? currentStatusCode === OrderStatusCode.RESERVED
                ? product.getAvailable(warehouse.id) + initialReservedQuantity
                : Number.MAX_SAFE_INTEGER
              : product.getAvailable(warehouse.id),
          });
        })
      );
  }, [product, activeWarehouses, reservations, initialReservations, currentStatusCode]);

  const defaultColumns = useReservationsColumns();

  const reservationsTable = useReactTable<ReservationRow>({
    data: reservationRows,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSave = () => {
    if (!validateForm(reservationRows)) return;

    saveReservations(
      reservationRows.map<Reservation>(r => r.toReservation()).filter(r => r.quantity > 0)
    );

    hide();
  };

  const hasReservations = reservationRows.length > 0;

  return (
    <DialogModalSecondary
      width="100%"
      isOpened={opened}
      maxWidth={hasReservations ? '640px' : '440px'}
      Header={t('select_the_warehouse_to_write_off')}
      maxHeight={hasReservations ? '400px' : '200px'}
      onClose={hide}
      onApprove={handleSave}
    >
      <Root>
        {hasReservations ? (
          <ReservationsTable reservationsTable={reservationsTable} />
        ) : (
          <AddStockPlaceholderWrapper>
            <AddStockPlaceholder sectionId={product.sectionId} sectionType={sectionType} />
          </AddStockPlaceholderWrapper>
        )}
      </Root>
    </DialogModalSecondary>
  );
});

ReservationsModal.displayName = 'ReservationsModal';
export { ReservationsModal };
