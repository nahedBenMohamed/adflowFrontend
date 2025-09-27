import { routes } from '@/app';
import { ActionsHeaderCell, InputWithPercent, MyCheckbox } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AvailableHeadCell, CardOrderAmountCell, CardOrderAvailableCell } from '../../../pages';
import type { OrderStore, WarehouseStore } from '../../../store';
import {
  CardOrderQuantityCellSwitch,
  NameCell,
  ProductsOrderDeleteItemCell,
  ProductsOrderDiscountCell,
  ProductsOrderPriceCell,
  ProductsOrderPriceHeadCell,
  ProductsOrderTaxHeaderCell,
} from '../components';
import {
  CardOrderColumnsIds,
  CardOrderColumnsSizes,
  ProductsSectionType,
  type OrderItemRow,
  type ProductPrice,
} from '../models';

export const useCardOrderColumns = ({
  orderStore,
  warehouseStore,
  reservedOrNotInitialized,
  showDeleteOrderOrClearItemsWarningModal,
}: {
  orderStore: OrderStore;
  warehouseStore: WarehouseStore;
  reservedOrNotInitialized: boolean;
  showDeleteOrderOrClearItemsWarningModal: () => void;
}) => {
  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_products_order_component.hooks.use_card_order_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<OrderItemRow>();

    const columns = [
      columnHelper.accessor('product.name', {
        id: CardOrderColumnsIds.NAME,
        header: t('name'),
        cell: info => {
          const name = info.getValue();
          const { id, sectionId } = info.row.original.product;

          return (
            <NameCell
              name={name}
              target="_blank"
              to={routes.product({
                sectionId: sectionId,
                sectionType: ProductsSectionType.SALE,
                productId: id,
              })}
            />
          );
        },
      }),

      columnHelper.accessor('price', {
        id: CardOrderColumnsIds.PRICE,
        size: CardOrderColumnsSizes[CardOrderColumnsIds.PRICE],
        minSize: CardOrderColumnsSizes[CardOrderColumnsIds.PRICE],
        maxSize: CardOrderColumnsSizes[CardOrderColumnsIds.PRICE],
        header: () => (
          <ProductsOrderPriceHeadCell
            currentCurrency={orderStore.currentCurrency}
            onCurrencyChange={orderStore.onCurrencyChange}
          />
        ),
        cell: info => {
          const model = info.getValue();
          const {
            id,
            discount,
            product: { prices },
          } = info.row.original;

          const handleSelectPrice = (price: ProductPrice) => {
            if (!price.maxDiscount) return;

            if (Number(discount.value) > price.maxDiscount)
              discount.setValue(String(price.maxDiscount));

            orderStore.setOrderRowMaxDiscountById({ rowId: id, maxDiscount: price.maxDiscount });
          };

          return (
            <ProductsOrderPriceCell
              model={model}
              prices={prices}
              handleSelectPrice={handleSelectPrice}
            />
          );
        },
      }),

      columnHelper.accessor('discount', {
        id: CardOrderColumnsIds.DISCOUNT,
        minSize: CardOrderColumnsSizes[CardOrderColumnsIds.DISCOUNT],
        maxSize: CardOrderColumnsSizes[CardOrderColumnsIds.DISCOUNT],
        size: CardOrderColumnsSizes[CardOrderColumnsIds.DISCOUNT],
        header: t('discount'),
        cell: info => {
          const discountModel = info.getValue();
          const { maxDiscount } = info.row.original;

          return (
            <ProductsOrderDiscountCell discountModel={discountModel} maxDiscount={maxDiscount} />
          );
        },
      }),

      columnHelper.accessor('tax', {
        id: CardOrderColumnsIds.TAX,
        minSize: CardOrderColumnsSizes[CardOrderColumnsIds.TAX],
        maxSize: CardOrderColumnsSizes[CardOrderColumnsIds.TAX],
        size: CardOrderColumnsSizes[CardOrderColumnsIds.TAX],
        header: () => <ProductsOrderTaxHeaderCell taxStrategy={orderStore.taxStrategy} />,
        cell: info => {
          const taxModel = info.getValue();

          return <InputWithPercent model={taxModel} width="92px" />;
        },
      }),

      columnHelper.display({
        id: CardOrderColumnsIds.AVAILABLE,
        minSize: CardOrderColumnsSizes[CardOrderColumnsIds.AVAILABLE],
        maxSize: CardOrderColumnsSizes[CardOrderColumnsIds.AVAILABLE],
        size: CardOrderColumnsSizes[CardOrderColumnsIds.AVAILABLE],
        header: () => <AvailableHeadCell />,
        cell: info =>
          info.row.original.product.isService() ? null : (
            <CardOrderAvailableCell
              cellInfo={info}
              orderStore={orderStore}
              warehouseStore={warehouseStore}
            />
          ),
      }),

      columnHelper.accessor('quantity', {
        id: CardOrderColumnsIds.QUANTITY,
        minSize: CardOrderColumnsSizes[CardOrderColumnsIds.QUANTITY],
        maxSize: CardOrderColumnsSizes[CardOrderColumnsIds.QUANTITY],
        size: CardOrderColumnsSizes[CardOrderColumnsIds.QUANTITY],
        header: t('quantity'),
        cell: info => (
          <CardOrderQuantityCellSwitch
            cellContext={info}
            orderStore={orderStore}
            warehouseStore={warehouseStore}
            reservedOrNotInitialized={reservedOrNotInitialized}
          />
        ),
      }),

      columnHelper.display({
        id: CardOrderColumnsIds.AMOUNT,
        minSize: CardOrderColumnsSizes[CardOrderColumnsIds.AMOUNT],
        maxSize: CardOrderColumnsSizes[CardOrderColumnsIds.AMOUNT],
        header: t('amount'),
        cell: info => (
          <CardOrderAmountCell
            cellInfo={info}
            taxStrategy={orderStore.taxStrategy}
            statusId={orderStore.order?.statusId}
            warehousesEnabled={orderStore.warehousesEnabled}
            currentWarehouse={orderStore.currentWarehouse}
          />
        ),
      }),

      columnHelper.display({
        id: CardOrderColumnsIds.ACTIONS,
        maxSize: CardOrderColumnsSizes[CardOrderColumnsIds.ACTIONS],
        minSize: CardOrderColumnsSizes[CardOrderColumnsIds.ACTIONS],
        size: CardOrderColumnsSizes[CardOrderColumnsIds.ACTIONS],
        header: ActionsHeaderCell,
        cell: info => {
          const { id: orderItemRowId } = info.row.original;

          return (
            <ProductsOrderDeleteItemCell
              orderStore={orderStore}
              disabled={!reservedOrNotInitialized}
              onDelete={() => orderStore.removeOrderItemRows([orderItemRowId])}
              showDeleteOrderOrClearItemsWarningModal={showDeleteOrderOrClearItemsWarningModal}
            />
          );
        },
      }),
    ];

    if (reservedOrNotInitialized) {
      columns.unshift(
        columnHelper.display({
          id: CardOrderColumnsIds.CHECKBOX,
          size: CardOrderColumnsSizes[CardOrderColumnsIds.CHECKBOX],
          minSize: CardOrderColumnsSizes[CardOrderColumnsIds.CHECKBOX],
          maxSize: CardOrderColumnsSizes[CardOrderColumnsIds.CHECKBOX],
          header: info => {
            const { getIsAllRowsSelected, getIsSomeRowsSelected, getToggleAllRowsSelectedHandler } =
              info.table;

            return (
              <MyCheckbox
                checked={getIsAllRowsSelected()}
                indeterminate={getIsSomeRowsSelected()}
                onChange={getToggleAllRowsSelectedHandler()}
              />
            );
          },
          cell: info => {
            const { getIsSelected, getToggleSelectedHandler } = info.row;

            return <MyCheckbox checked={getIsSelected()} onChange={getToggleSelectedHandler()} />;
          },
        })
      );
    }

    return columns;
  }, [
    warehouseStore,
    orderStore,
    reservedOrNotInitialized,
    t,
    showDeleteOrderOrClearItemsWarningModal,
  ]);
};
