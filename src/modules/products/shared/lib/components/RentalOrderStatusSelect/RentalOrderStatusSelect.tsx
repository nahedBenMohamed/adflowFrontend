import { MySelectColored, type SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { generateRentalOrderStatusOptions } from '../../helpers';
import type { RentalOrderStatus } from '../../models';

interface RootProps {
  visible: boolean;
  margin?: CSSProperties['margin'];
}

const Root = styled.div<RootProps>`
  width: ${p => (p.visible ? '224px' : 0)};

  margin: ${p => p.margin};
  transform-origin: center right;
  transition: var(--transition-200);
  scale: ${p => (p.visible ? 1 : 0)};
  opacity: ${p => (p.visible ? 1 : 0)};
  transition-delay: ${p => (p.visible ? 'var(--transition-duration)' : 0)};
`;

export interface RentalOrderStatusSelectProps {
  model: SelectModel;
  visible?: boolean;
  margin?: CSSProperties['margin'];
  disabled?: boolean;
  onChange?: (status: RentalOrderStatus) => void;
}

const RentalOrderStatusSelect = observer((props: RentalOrderStatusSelectProps) => {
  const { visible = true, model, margin, disabled, onChange } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.rental_order_status_select',
  });

  const options = generateRentalOrderStatusOptions(t);

  return (
    <Root visible={visible} margin={margin}>
      <MySelectColored
        withinPortal
        model={model}
        options={options}
        disabled={disabled}
        placeholder={t('placeholders.select_status')}
        handleChange={onChange}
      />
    </Root>
  );
});

RentalOrderStatusSelect.displayName = 'RentalOrderStatusSelect';
export { RentalOrderStatusSelect };
