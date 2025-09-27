import { MyInput, MyTooltip, type InputModel, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { QuantityControlButton } from '../../QuantityControlButton/QuantityControlButton';

const Root = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;

  input {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: var(--button-text-graphite-secondary-text);
  }
`;

interface Props {
  model: InputModel;
  maxQuantity: Nullable<number>;
  disabled?: boolean;
}

const ReservationQuantityCell = observer((props: Props) => {
  const { model, maxQuantity, disabled } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common',
  });

  const increment = () => model.setNumberValue(model.asNumber() + 1);
  const decrement = () => model.setNumberValue(model.asNumber() - 1);

  const inactive = maxQuantity === 0 && model.asNumber() >= maxQuantity;

  return disabled ? (
    <MyTooltip withinPortal disabled={!disabled} label={t('readonly_stocks')}>
      <Root>
        <MyInput model={model} variant="outlined" textAlign="center" disabled />
      </Root>
    </MyTooltip>
  ) : (
    <Root>
      <QuantityControlButton
        type="decrement"
        disabled={model.asNumber() <= 1}
        onClick={decrement}
      />

      <MyInput model={model} variant="outlined" textAlign="center" disabled={inactive} />

      <QuantityControlButton
        type="increment"
        disabled={inactive || maxQuantity !== null ? model.asNumber() >= maxQuantity : false}
        onClick={increment}
      />
    </Root>
  );
});

ReservationQuantityCell.displayName = 'ReservationQuantityCell';
export { ReservationQuantityCell };
