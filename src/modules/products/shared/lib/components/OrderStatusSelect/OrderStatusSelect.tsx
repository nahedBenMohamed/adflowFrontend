import { MySelectColored, type Option, type SelectModel } from '@/shared';
import { TruncateMixin } from '@/shared/lib/mixins/Truncate.mixin';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { type OrderStatus } from '../../../../shared';
import { orderStatusStore } from '../../../../store';

interface RootProps {
  $visible: boolean;
  $margin?: CSSProperties['margin'];
}

const Root = styled.div<RootProps>`
  width: ${p => (p.$visible ? '224px' : 0)};

  margin: ${p => p.$margin};
  transform-origin: center right;
  transition: var(--transition-200);
  scale: ${p => (p.$visible ? 1 : 0)};
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition-delay: ${p => (p.$visible ? 'var(--transition-duration)' : 0)};

  ${TruncateMixin}
`;

export interface OrderStatusSelectProps {
  model: SelectModel;
  statuses: OrderStatus[];
  visible?: boolean;
  disabled?: boolean;
  margin?: CSSProperties['margin'];
  onChange?: (value: number) => void;
}

const OrderStatusSelect = observer((props: OrderStatusSelectProps) => {
  const { visible = true, model, statuses, margin, disabled, onChange } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.order_status_select',
  });

  const getOption = useCallback(
    (status: OrderStatus): Option<number, { bgColor: string }> => ({
      label: t(`statuses.${status.code}`),
      value: status.id,
      extra: {
        bgColor: status.color,
      },
    }),
    [t]
  );

  const options = useMemo<Option<number, { bgColor: string }>[]>(
    () => statuses.map(s => getOption(s)),
    [statuses, getOption]
  );

  const selectedStatus = model.value ? orderStatusStore.getById(model.value) : undefined;
  const selectedOption = selectedStatus ? getOption(selectedStatus) : undefined;

  const handleChange = useCallback(
    (value: number) => {
      onChange?.(value);
    },
    [onChange]
  );

  return (
    <Root $visible={visible} $margin={margin}>
      <MySelectColored
        withinPortal
        width={224}
        model={model}
        options={options}
        disabled={disabled}
        selectedOption={selectedOption}
        placeholder={t('placeholders.select_status')}
        handleChange={handleChange}
      />
    </Root>
  );
});

OrderStatusSelect.displayName = 'OrderStatusSelect';
export { OrderStatusSelect };
