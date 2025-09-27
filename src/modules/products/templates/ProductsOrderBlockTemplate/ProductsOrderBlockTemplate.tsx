import { EmptyTableBlock, SpanWithEllipsis, TableSkeleton, type Currency } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BlockFooterControls,
  ProductsOrderTotalBlock,
  RemoveSelectedBlock,
  generateOrderName,
  type BlockFooterApproveProps,
  type BlockFooterCancelProps,
} from '../../shared';
import { ProductsOrderPanelTemplate } from '../ProductsOrderPanelTemplate/ProductsOrderPanelTemplate';

const TotalBlockWrapper = styled.div`
  margin-right: auto;
`;

export interface ProductsOrderBlockTemplateButtonsState {
  approve: {
    disabled: boolean;
    loading: boolean;
  };
  cancel: {
    disabled: boolean;
  };
}

interface Props {
  Table: ReactNode;
  Header: ReactNode;
  entityName: string;
  totalAmount: number;
  showSkeleton: boolean;
  currentCurrency: Currency;
  showRemoveSelected: boolean;
  orderItemRowsLength: number;
  buttonsState: ProductsOrderBlockTemplateButtonsState;
  orderNumber?: number;
  handleRemoveSelected: () => void;
  handleCancelChanges: () => void;
  handleSaveOrder: () => void;
}

const ProductsOrderBlockTemplate = observer((props: Props) => {
  const {
    Table,
    Header,
    entityName,
    totalAmount,
    showSkeleton,
    currentCurrency,
    showRemoveSelected,
    orderItemRowsLength,
    buttonsState: {
      approve: { disabled: approveDisabled, loading: approveLoading },
      cancel: { disabled: cancelDisabled },
    },
    orderNumber,
    handleRemoveSelected,
    handleCancelChanges,
    handleSaveOrder,
  } = props;

  const { t: t1 } = useTranslation('module.products', {
    keyPrefix: 'products.pages.card_products_order_page.templates.products_order_block_template',
  });

  const { t: t2 } = useTranslation('module.products', {
    keyPrefix: 'products.pages.card_products_orders_page.hooks.use_products_section_orders_columns',
  });

  const approveProps = useMemo<BlockFooterApproveProps>(
    () => ({
      title: t1('save'),
      disabled: approveDisabled,
      loading: approveLoading,
      handler: handleSaveOrder,
    }),
    [approveDisabled, approveLoading, t1, handleSaveOrder]
  );

  const cancelProps = useMemo<BlockFooterCancelProps>(
    () => ({
      title: t1('cancel'),
      disabled: cancelDisabled,
      handler: handleCancelChanges,
    }),
    [cancelDisabled, t1, handleCancelChanges]
  );

  return (
    <ProductsOrderPanelTemplate
      order={0}
      HeaderContent={Header}
      id="workspace__ProductsOrderBlockTemplate--Root"
      title={
        <SpanWithEllipsis
          text={
            entityName +
            (orderNumber
              ? ` – ${generateOrderName({ orderNumber, t: t2 })}`
              : ` – ${t1('new_order')}`)
          }
        />
      }
      Controls={
        <BlockFooterControls approveProps={approveProps} cancelProps={cancelProps}>
          {orderItemRowsLength > 0 && (
            <TotalBlockWrapper>
              <ProductsOrderTotalBlock
                totalAmount={totalAmount}
                currentCurrency={currentCurrency}
              />
            </TotalBlockWrapper>
          )}

          <RemoveSelectedBlock visible={showRemoveSelected} onClick={handleRemoveSelected} />
        </BlockFooterControls>
      }
    >
      {showSkeleton ? (
        <TableSkeleton />
      ) : orderItemRowsLength ? (
        Table
      ) : (
        <EmptyTableBlock>{t1('empty')}</EmptyTableBlock>
      )}
    </ProductsOrderPanelTemplate>
  );
});

ProductsOrderBlockTemplate.displayName = 'ProductsOrderBlockTemplate';
export { ProductsOrderBlockTemplate };
