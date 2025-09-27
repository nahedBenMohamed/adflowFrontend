import {
  BaseTable,
  DropdownScrollbarMixin,
  MyInput,
  MyPopover,
  useModalControl,
  type InputModel,
} from '@/shared';
import {
  getCoreRowModel,
  useReactTable,
  type Cell,
  type Header,
  type Row,
} from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback, type CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { UnfoldIcon } from '../../../../assets';
import { usePriceCellColumns } from '../../../hooks';
import { PriceCellColumnsIds, type ProductPrice } from '../../../models';

const Root = styled.div`
  max-height: 320px;

  ${DropdownScrollbarMixin}

  padding: 0;
`;

const InputWrapper = styled.div<{ $withIcon: boolean }>`
  position: relative;

  &:hover {
    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-blue-active);
    }
  }

  ${p =>
    p.$withIcon &&
    css`
      input {
        padding-right: 24px;
      }
    `}
`;

const UnfoldIconWrapper = styled.div<{ $active: boolean }>`
  position: absolute;
  right: 6px;
  top: 5px;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--primary-statuses-green-520);
      }
    `}
`;

interface Props {
  model: InputModel;
  prices: ProductPrice[];
  inModal?: boolean;
  handleSelectPrice?: (price: ProductPrice) => void;
}

const ProductsOrderPriceCell = observer((props: Props) => {
  const { model, prices, inModal, handleSelectPrice } = props;

  const popoverControl = useModalControl(false);

  const defaultColumns = usePriceCellColumns();

  const cardOrderPriceCellTable = useReactTable({
    data: prices,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSelect = useCallback(
    (row: Row<ProductPrice>) => {
      model.setNumberValue(row.original.unitPrice);

      handleSelectPrice?.(row.original);
      popoverControl.close();
    },
    [model, popoverControl, handleSelectPrice]
  );

  const moreThanOnePrice = prices.length > 1;

  return (
    <MyPopover
      withinPortal
      width="336px"
      inModal={inModal}
      opened={moreThanOnePrice ? popoverControl.opened : false}
      Target={
        <InputWrapper $withIcon={moreThanOnePrice}>
          <MyInput model={model} variant="outlined" onFocus={popoverControl.open} />

          {moreThanOnePrice && (
            <UnfoldIconWrapper $active={popoverControl.opened} onClick={popoverControl.open}>
              <UnfoldIcon />
            </UnfoldIconWrapper>
          )}
        </InputWrapper>
      }
      hide={popoverControl.close}
    >
      <Root>
        <BaseTable
          table={cardOrderPriceCellTable}
          headProps={{
            getCellStyleFn: (header: Header<ProductPrice, unknown>): CSSProperties => {
              if (header.column.id === PriceCellColumnsIds.NAME) return { flex: 1 };

              return { width: header.column.getSize() };
            },
          }}
          bodyProps={{
            onSelect: handleSelect,
            getCellStyleFn: (cell: Cell<ProductPrice, unknown>): CSSProperties => {
              if (cell.column.id === PriceCellColumnsIds.NAME) return { flex: 1 };

              return { width: cell.column.getSize() };
            },
          }}
        />
      </Root>
    </MyPopover>
  );
});

ProductsOrderPriceCell.displayName = 'ProductsOrderPriceCell';
export { ProductsOrderPriceCell };
