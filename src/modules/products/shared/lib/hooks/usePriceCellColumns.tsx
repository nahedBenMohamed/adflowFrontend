import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CurrencyCell } from '../../../pages';
import { PriceCellColumnsIds, PriceCellColumnsSizes, type ProductPrice } from '../models';

const NameFallback = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
`;

export const usePriceCellColumns = () => {
  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.card_products_order_page.hooks.use_price_cell_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<ProductPrice>();

    return [
      columnHelper.accessor('name', {
        id: PriceCellColumnsIds.NAME,
        header: t('name'),
        cell: info => info.getValue() || <NameFallback>{t('name_fallback')}</NameFallback>,
      }),

      columnHelper.accessor('unitPrice', {
        id: PriceCellColumnsIds.PRICE,
        size: PriceCellColumnsSizes[PriceCellColumnsIds.PRICE],
        minSize: PriceCellColumnsSizes[PriceCellColumnsIds.PRICE],
        header: t('price'),
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('currency', {
        id: PriceCellColumnsIds.CURRENCY,
        size: PriceCellColumnsSizes[PriceCellColumnsIds.CURRENCY],
        minSize: PriceCellColumnsSizes[PriceCellColumnsIds.CURRENCY],
        header: t('currency'),
        cell: info => <CurrencyCell>{info.getValue()}</CurrencyCell>,
      }),
    ];
  }, [t]);
};
