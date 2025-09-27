import type { Option } from '@/shared';
import type { TFunction } from 'i18next';
import { RentalOrderStatus } from '../models';

export const generateRentalOrderStatusOptions = (
  t: TFunction
): Option<
  RentalOrderStatus,
  {
    bgColor: string;
  }
>[] => [
  {
    label: t('formed'),
    value: RentalOrderStatus.FORMED,
    extra: {
      bgColor: 'var(--primary-statuses-noun-440)',
    },
  },
  {
    label: t('reserved'),
    value: RentalOrderStatus.RESERVED,
    extra: {
      bgColor: 'var(--primary-statuses-orange-440)',
    },
  },
  {
    label: t('sent_to_warehouse'),
    value: RentalOrderStatus.SENT_TO_WAREHOUSE,
    extra: {
      bgColor: 'var(--primary-statuses-purple-360)',
    },
  },
  {
    label: t('shipped'),
    value: RentalOrderStatus.SHIPPED,
    extra: {
      bgColor: 'var(--primary-statuses-green-520)',
    },
  },
  {
    label: t('delivered'),
    value: RentalOrderStatus.DELIVERED,
    extra: {
      bgColor: 'var(--primary-statuses-pink-360)',
    },
  },
  {
    label: t('returned'),
    value: RentalOrderStatus.RETURNED,
    extra: {
      bgColor: 'var(--graphite-graphite-280)',
    },
  },
  {
    label: t('accepted_to_warehouse'),
    value: RentalOrderStatus.ACCEPTED_TO_WAREHOUSE,
    extra: {
      bgColor: 'var(--primary-statuses-purple-360)',
    },
  },
  {
    label: t('cancelled'),
    value: RentalOrderStatus.CANCELLED,
    extra: {
      bgColor: 'var(--primary-statuses-red-360)',
    },
  },
];
