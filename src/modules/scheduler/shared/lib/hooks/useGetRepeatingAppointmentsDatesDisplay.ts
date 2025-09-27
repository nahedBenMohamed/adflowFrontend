import type { UtcDate } from '@/shared';
import { useTranslation } from 'react-i18next';
import { RepeatingAppointmentInterval } from '../types';

// Generates string representing when recurring appointments will be created.
// Example: "Recurring visits are scheduled for 25 October and 26 October at 10:00 AM"
export const useGetRepeatingAppointmentsDatesDisplay = ({
  visits,
  interval,
}: {
  visits: UtcDate[];
  interval: RepeatingAppointmentInterval;
}): string => {
  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal.repeating_appointments_block.dates_display',
  });

  if (visits.length === 1) {
    // Most simple case: "The recurring visit is scheduled for 25 October at 10:00 AM"

    return t('one_visit', { date: visits[0]?.displayLong(), time: visits[0]?.displayTime() });
  } else if (visits.length < 5) {
    // Few appointments, so we can list them. Do not forget about "and" before last date.
    // Example: "Recurring visits are scheduled for 25 October and 26 October at 10:00 AM"

    let dates = '';

    visits.forEach((v, idx) => {
      dates += `${idx === visits.length - 1 ? t('and') : ''}${v.format('D MMMM')}${idx === visits.length - 1 || idx === visits.length - 2 ? '' : ', '}`;
    });

    return t('visits_list', { dates, time: visits[0]?.displayTime() });
  } else {
    // Many appointments, so show them as duration
    // Example: Recurring visits are scheduled daily from 25 October to 25 November at 10:00 AM

    if (interval === RepeatingAppointmentInterval.DAY) {
      return t('visits_interval_day', {
        from: visits[0]?.displayLong(),
        to: visits.at(-1)?.displayLong(),
        time: visits[0]?.displayTime(),
      });
    } else if (interval === RepeatingAppointmentInterval.WEEK) {
      return t('visits_interval_week', {
        from: visits[0]?.displayLong(),
        to: visits.at(-1)?.displayLong(),
        time: visits[0]?.displayTime(),
      });
    } else if (interval === RepeatingAppointmentInterval.MONTH) {
      return t('visits_interval_month', {
        from: visits[0]?.displayLong(),
        to: visits.at(-1)?.displayLong(),
        time: visits[0]?.displayTime(),
      });
    } else {
      return '';
    }
  }
};
