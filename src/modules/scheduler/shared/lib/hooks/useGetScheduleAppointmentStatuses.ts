import type { Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAppointmentStatusColor } from '../helpers';
import { ScheduleAppointmentStatus } from '../models';

export const useGetScheduleAppointmentStatusesOptions = (): Option<
  ScheduleAppointmentStatus,
  {
    bgColor: string;
  }
>[] => {
  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.statuses',
  });

  return useMemo(
    () => [
      {
        value: ScheduleAppointmentStatus.NOT_CONFIRMED,
        label: t('scheduled'),
        extra: {
          bgColor: getAppointmentStatusColor(ScheduleAppointmentStatus.NOT_CONFIRMED),
        },
      },
      {
        value: ScheduleAppointmentStatus.CONFIRMED,
        label: t('confirmed'),
        extra: {
          bgColor: getAppointmentStatusColor(ScheduleAppointmentStatus.CONFIRMED),
        },
      },
      {
        value: ScheduleAppointmentStatus.COMPLETED,
        label: t('completed'),
        extra: {
          bgColor: getAppointmentStatusColor(ScheduleAppointmentStatus.COMPLETED),
        },
      },
      {
        value: ScheduleAppointmentStatus.CANCELLED,
        label: t('cancelled'),
        extra: {
          bgColor: getAppointmentStatusColor(ScheduleAppointmentStatus.CANCELLED),
        },
      },
    ],
    [t]
  );
};
