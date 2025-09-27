import { MySelect, type Option, type SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TaxStrategy } from '../../../models';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  taxStrategy: SelectModel;
}

const ProductsOrderTaxHeaderCell = observer((props: Props) => {
  const { taxStrategy } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.card_products_order_page.common.products_order_tax_header_cell',
  });

  const taxStrategyOptions = useMemo<Option<TaxStrategy>[]>(
    () => [
      {
        label: t('tax_included'),
        value: TaxStrategy.INCLUDED,
      },
      {
        label: t('tax_excluded'),
        value: TaxStrategy.EXCLUDED,
      },
    ],
    [t]
  );

  return (
    <Root>
      <span>{t('tax')}</span>

      <MySelect
        withinPortal
        titleMinWidth={0}
        model={taxStrategy}
        variant="empty-small"
        dropdownMinWidth="160px"
        options={taxStrategyOptions}
      />
    </Root>
  );
});

ProductsOrderTaxHeaderCell.displayName = 'ProductsOrderTaxHeaderCell';
export { ProductsOrderTaxHeaderCell };
