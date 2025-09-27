import { InfoMediumIcon, currencyFormatterHelper, type Currency } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Title = styled.h4`
  font-weight: 600;
  line-height: 20px;
  font-size: 14px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  currentCurrency: Currency;
  totalAmount: number;
}

const ProductsOrderTotalBlock = observer((props: Props) => {
  const { currentCurrency, totalAmount } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.card_products_order_page.common.products_order_total_block',
  });

  return (
    <Root>
      <InfoMediumIcon />

      <Title>
        {t('total', {
          total: currencyFormatterHelper.format({
            value: totalAmount,
            currency: currentCurrency as Currency,
          }),
        })}
      </Title>
    </Root>
  );
});

ProductsOrderTotalBlock.displayName = 'ProductsOrderTotalBlock';
export { ProductsOrderTotalBlock };
