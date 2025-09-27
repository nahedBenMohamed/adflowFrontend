import { routes } from '@/app';
import { ActionsHeaderCell, InputWithPercent, MyCheckbox } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CardRentalOrderAmountCell } from '../../../pages';
import type { RentalOrderStore } from '../../../store';
import {
  NameCell,
  ProductsOrderDeleteItemCell,
  ProductsOrderDiscountCell,
  ProductsOrderPriceCell,
  ProductsOrderPriceHeadCell,
  ProductsOrderTaxHeaderCell,
  RentalAvailabilityCell,
} from '../components';
import {
  ProductsSectionType,
  RentalCardOrderColumnsIds,
  RentalCardOrderColumnsSizes,
  type ProductPrice,
  type RentalOrderItemRow,
} from '../models';

export const useRentalCardOrderColumns = ({
  orderStore,
  showDeleteRentalOrderOrClearItemsWarningModal,
}: {
  orderStore: RentalOrderStore;
  showDeleteRentalOrderOrClearItemsWarningModal: () => void;
}) => {
  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_rental_products_order_component.hooks.use_rental_card_order_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<RentalOrderItemRow>();

    return [
      columnHelper.display({
        id: RentalCardOrderColumnsIds.CHECKBOX,
        size: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.CHECKBOX],
        minSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.CHECKBOX],
        maxSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.CHECKBOX],
        header: ({
          table: { getIsAllRowsSelected, getIsSomeRowsSelected, getToggleAllRowsSelectedHandler },
        }) => (
          <MyCheckbox
            checked={getIsAllRowsSelected()}
            indeterminate={getIsSomeRowsSelected()}
            onChange={getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row: { getIsSelected, getToggleSelectedHandler } }) => (
          <MyCheckbox checked={getIsSelected()} onChange={getToggleSelectedHandler()} />
        ),
      }),

      columnHelper.accessor('product.name', {
        id: RentalCardOrderColumnsIds.NAME,
        header: t('name'),
        cell: info => {
          const name = info.getValue();
          const { id, sectionId } = info.row.original.product;

          return (
            <NameCell
              name={name}
              target="_blank"
              to={routes.product({
                sectionId,
                sectionType: ProductsSectionType.RENTAL,
                productId: id,
              })}
            />
          );
        },
      }),

      columnHelper.accessor('price', {
        id: RentalCardOrderColumnsIds.PRICE,
        size: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.PRICE],
        minSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.PRICE],
        maxSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.PRICE],
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

            orderStore.setOrderRowMaxDiscountById(id, price.maxDiscount);
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
        id: RentalCardOrderColumnsIds.DISCOUNT,
        minSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.DISCOUNT],
        maxSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.DISCOUNT],
        size: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.DISCOUNT],
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
        id: RentalCardOrderColumnsIds.TAX,
        minSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.TAX],
        maxSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.TAX],
        size: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.TAX],
        header: () => <ProductsOrderTaxHeaderCell taxStrategy={orderStore.taxStrategy} />,
        cell: info => {
          const taxModel = info.getValue();

          return <InputWithPercent model={taxModel} width="92px" />;
        },
      }),

      columnHelper.display({
        id: RentalCardOrderColumnsIds.AMOUNT,
        minSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.AMOUNT],
        maxSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.AMOUNT],
        header: t('amount'),
        cell: info => (
          <CardRentalOrderAmountCell
            cellInfo={info}
            taxStrategy={orderStore.taxStrategy}
            numberOfDays={orderStore.totalRentingDays}
            currentWarehouse={orderStore.currentWarehouse}
          />
        ),
      }),

      columnHelper.accessor('product.rentalStatus', {
        id: RentalCardOrderColumnsIds.AVAILABILITY,
        minSize: RentalCardOrderColumnsSizes.min,
        maxSize: RentalCardOrderColumnsSizes.max,
        header: t('availability'),
        cell: info => {
          const status = info.getValue();

          return <RentalAvailabilityCell status={status} />;
        },
      }),

      columnHelper.display({
        id: RentalCardOrderColumnsIds.ACTIONS,
        maxSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.ACTIONS],
        minSize: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.ACTIONS],
        size: RentalCardOrderColumnsSizes[RentalCardOrderColumnsIds.ACTIONS],
        header: ActionsHeaderCell,
        cell: info => {
          const { id: orderItemRowId } = info.row.original;

          return (
            <ProductsOrderDeleteItemCell
              orderStore={orderStore}
              showDeleteOrderOrClearItemsWarningModal={
                showDeleteRentalOrderOrClearItemsWarningModal
              }
              onDelete={() => orderStore.removeOrderItemRows([orderItemRowId])}
            />
          );
        },
      }),
    ];
  }, [orderStore, t, showDeleteRentalOrderOrClearItemsWarningModal]);
};
