import { generalSettingsStore } from '@/app';
import { TruncateMixin, currencyFormatterHelper } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { ProductPrice } from '../../../models';

const Root = styled.span<{ $inactive: boolean }>`
  color: ${p => p.$inactive && 'var(--button-text-graphite-secondary-text)'};
  transition: var(--transition-200);

  ${TruncateMixin}
`;

interface Props {
  prices: ProductPrice[];
  inactive?: boolean;
}

const ProductPriceCell = observer((props: Props) => {
  const { prices, inactive = false } = props;

  const defaultCurrency = generalSettingsStore.accountSettings?.currency;

  const price = prices.find(p => p.currency === defaultCurrency);

  if (price) {
    return (
      <Root $inactive={inactive}>
        {currencyFormatterHelper.format({ value: price.unitPrice, currency: price.currency })}
      </Root>
    );
  } else {
    return prices[0] ? (
      <Root $inactive={inactive}>
        {currencyFormatterHelper.format({
          value: prices[0].unitPrice,
          currency: prices[0].currency,
        })}
      </Root>
    ) : null;
  }
});

ProductPriceCell.displayName = 'ProductPriceCell';
export { ProductPriceCell };
