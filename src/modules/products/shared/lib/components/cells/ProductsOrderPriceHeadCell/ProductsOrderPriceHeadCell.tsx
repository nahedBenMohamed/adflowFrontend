import { CurrencySelect, type Currency, type SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  currentCurrency: SelectModel;
  onCurrencyChange?: (currency: Currency) => void;
}

const ProductsOrderPriceHeadCell = observer((props: Props) => {
  const { currentCurrency, onCurrencyChange } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.card_products_order_page.common.products_order_price_head_cell',
  });

  return (
    <Root>
      <span>{t('price')}</span>

      <CurrencySelect
        withLabel
        titleMinWidth={0}
        variant="empty-small"
        titleMaxWidth="134px"
        model={currentCurrency}
        dropdownMinWidth="200px"
        handleChange={onCurrencyChange}
      />
    </Root>
  );
});

export { ProductsOrderPriceHeadCell };
