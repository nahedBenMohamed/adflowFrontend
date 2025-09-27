import { generalSettingsStore } from '@/app';
import { Currency, PlusIconButton } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PriceForm } from '../../../../shared';
import { ProductPriceItem } from './ProductPriceItem';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  prices: PriceForm[];
}

const ProductPriceList = observer((props: Props) => {
  const { prices } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.ui.product_price_list',
  });

  const defaultCurrency = generalSettingsStore.accountSettings?.currency;

  const addPrice = () => prices.push(PriceForm.create(defaultCurrency ?? Currency.USD));

  const onDelete = (idx: number) => prices.splice(idx, 1);

  return (
    <Root>
      {prices.map((p, idx) => (
        <ProductPriceItem
          key={idx}
          form={p}
          isSingleItem={prices.length === 1}
          onDelete={() => onDelete(idx)}
        />
      ))}

      <PlusIconButton text={t('add_price')} onClick={addPrice} />
    </Root>
  );
});

ProductPriceList.displayName = 'ProductPriceList';
export { ProductPriceList };
