import { MyInput, useModalControl } from '@/shared';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import {
  type CreateStockRow,
  StockQuantityBlock,
  useCreateStocksColumns,
} from '../../../../../../shared';
import type { WarehouseStore } from '../../../../../../store';
import { CreateStocksModal } from './CreateStocksModal';

const StockQuantityBlockWrapper = styled.div`
  width: 50%;
`;

interface Props {
  warehouseStore: WarehouseStore;
  createStockRows: CreateStockRow[];
}

const CreateStocksBlock = observer((props: Props) => {
  const { warehouseStore, createStockRows } = props;

  const modalControl = useModalControl(false);

  const defaultColumns = useCreateStocksColumns(warehouseStore);

  const createStocksTable = useReactTable<CreateStockRow>({
    data: createStockRows,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const quantity = createStockRows.reduce<number>(
    (acc, row) => acc + row.stockQuantity.asNumber(),
    0
  );

  return (
    <>
      <StockQuantityBlockWrapper>
        {createStockRows.length > 1 ? (
          <StockQuantityBlock onClick={modalControl.open}>{quantity}</StockQuantityBlock>
        ) : (
          createStockRows[0] && (
            <MyInput variant="outlined" model={createStockRows[0].stockQuantity} />
          )
        )}
      </StockQuantityBlockWrapper>

      {modalControl.opened && (
        <CreateStocksModal
          opened={modalControl.opened}
          createStocksTable={createStocksTable}
          hide={modalControl.close}
        />
      )}
    </>
  );
});

CreateStocksBlock.displayName = 'CreateStocksBlock';
export { CreateStocksBlock };
