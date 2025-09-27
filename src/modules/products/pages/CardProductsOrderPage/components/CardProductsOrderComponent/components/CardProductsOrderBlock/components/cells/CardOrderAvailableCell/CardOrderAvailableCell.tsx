import { DropdownScrollbarMixin, MyHoverCard } from '@/shared';
import { getCoreRowModel, useReactTable, type CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import {
  AddStockPlaceholder,
  ProductsSectionType,
  StockCell,
  useAvailableCellColumns,
  type OrderItemRow,
  type Stock,
} from '../../../../../../../../../shared';
import type { OrderStore, WarehouseStore } from '../../../../../../../../../store';
import { AvailableCellTable } from '../AvailableCellTable/AvailableCellTable';

const StockCellWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const HoverCardRoot = styled.div`
  max-height: 224px;

  overflow-y: auto;

  ${DropdownScrollbarMixin}

  padding: 0;
`;

const AddStockPlaceholderWrapper = styled.div`
  padding: 8px 16px;
`;

interface Props {
  orderStore: OrderStore;
  warehouseStore: WarehouseStore;
  cellInfo: CellContext<OrderItemRow, unknown>;
}

const CardOrderAvailableCell = observer((props: Props) => {
  const { orderStore, warehouseStore, cellInfo } = props;

  const available = cellInfo.row.original.getAvailable(orderStore.currentWarehouse.value ?? null);

  const { product } = cellInfo.row.original;

  const defaultColumns = useAvailableCellColumns(warehouseStore);

  const availableCellTable = useReactTable<Stock>({
    columns: defaultColumns,
    data: orderStore.currentWarehouse.value
      ? product.stocks.filter(s => s.warehouseId === orderStore.currentWarehouse.value)
      : product.stocks,
    getCoreRowModel: getCoreRowModel(),
  });

  const hasStocks = product.stocks.length > 0;

  return (
    <MyHoverCard
      withinPortal
      openDelay={100}
      width={hasStocks ? '464px' : 'fit-content'}
      target={
        <StockCellWrapper>
          <StockCell color={available > 0 ? 'green' : 'red'} stock={available} />
        </StockCellWrapper>
      }
    >
      <HoverCardRoot>
        {product.stocks.length > 0 ? (
          <AvailableCellTable availableCellTable={availableCellTable} />
        ) : (
          <AddStockPlaceholderWrapper>
            <AddStockPlaceholder
              sectionId={product.sectionId}
              sectionType={ProductsSectionType.SALE}
            />
          </AddStockPlaceholderWrapper>
        )}
      </HoverCardRoot>
    </MyHoverCard>
  );
});

CardOrderAvailableCell.displayName = 'CardOrderAvailableCell';
export { CardOrderAvailableCell };
