import { generalSettingsStore } from '@/app';
import { Currency, currencyFormatterHelper, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Value } from './CommonEntityCardItem.styles';

interface Props {
  price: Nullable<number>;
  isOnSystemStage: boolean;
}

const CommonEntityCardItemPriceBlock = observer((props: Props) => {
  const { price, isOnSystemStage } = props;

  const { accountSettings } = generalSettingsStore;

  const formattedPrice =
    price !== null
      ? currencyFormatterHelper.format({
          value: price,
          currency: accountSettings?.currency ?? Currency.USD,
        })
      : null;

  // <span /> – to preserve layout
  return formattedPrice ? <Value $gray={isOnSystemStage}>{formattedPrice}</Value> : <span />;
});

CommonEntityCardItemPriceBlock.displayName = 'CommonEntityCardItemPriceBlock';
export { CommonEntityCardItemPriceBlock };
