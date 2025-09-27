import { generalSettingsStore } from '@/app';
import type { OrderItem, Product } from '@/modules/products';
import { Currency, currencyFormatterHelper } from '@/shared';
import { useTranslation } from 'react-i18next';
import { AppointmentEventHoverCardBlock } from '../AppointmentEventHoverCardBlock/AppointmentEventHoverCardBlock';
import { AppointmentEventHoverCardFormGroup } from '../AppointmentEventHoverCardFormGroup/AppointmentEventHoverCardFormGroup';

interface Props {
  service: Product;
  orderItem: OrderItem;
  currency?: Currency;
}

const AppointmentEventHoverCardService = (props: Props) => {
  const { service, orderItem, currency } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page',
  });

  return (
    <AppointmentEventHoverCardBlock title={service.name}>
      <AppointmentEventHoverCardFormGroup label={t('price')}>
        {currencyFormatterHelper.format({
          value: orderItem.unitPrice,
          currency: currency ?? generalSettingsStore.accountSettings?.currency ?? Currency.USD,
        })}
      </AppointmentEventHoverCardFormGroup>

      <AppointmentEventHoverCardFormGroup label={t('quantity')}>
        {orderItem.quantity}
      </AppointmentEventHoverCardFormGroup>

      <AppointmentEventHoverCardFormGroup label={t('discount')}>
        {orderItem.discount}%
      </AppointmentEventHoverCardFormGroup>
    </AppointmentEventHoverCardBlock>
  );
};

export { AppointmentEventHoverCardService };
