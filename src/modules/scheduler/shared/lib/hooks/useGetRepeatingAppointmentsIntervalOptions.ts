import type { Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RepeatingAppointmentInterval } from '../types';

export const useGetRepeatingAppointmentsIntervalOptions = () => {
  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal.repeating_appointments_block.intervals',
  });

  return useMemo<Option<RepeatingAppointmentInterval>[]>(
    () => [
      {
        label: t('none'),
        value: RepeatingAppointmentInterval.NONE,
      },
      {
        label: t('day'),
        value: RepeatingAppointmentInterval.DAY,
      },
      {
        label: t('week'),
        value: RepeatingAppointmentInterval.WEEK,
      },
      {
        label: t('month'),
        value: RepeatingAppointmentInterval.MONTH,
      },
    ],
    [t]
  );
};
