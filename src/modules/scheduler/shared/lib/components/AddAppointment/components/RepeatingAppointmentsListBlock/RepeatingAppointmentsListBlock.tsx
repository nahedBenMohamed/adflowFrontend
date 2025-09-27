import type { UtcDate } from '@/shared';
import { useTranslation } from 'react-i18next';
import type { RepeatingAppointmentsParameters } from '../../../../models';
import { AppointmentBlock } from '../AppointmentBlock/AppointmentBlock';
import { AppointmentFormItem } from '../AppointmentFormItem/AppointmentFormItem';
import { RepeatingAppointmentsDatesSelect } from './components';

interface Props {
  parameters: RepeatingAppointmentsParameters;
  startDate: UtcDate;
}

const RepeatingAppointmentsListBlock = (props: Props) => {
  const { parameters, startDate } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal.repeating_appointments_block.list',
  });

  return (
    <AppointmentBlock headerTitle={t('title')} hint={t('hint')}>
      <AppointmentFormItem label={t('dates_select')}>
        <RepeatingAppointmentsDatesSelect datesParameters={parameters} startDate={startDate} />
      </AppointmentFormItem>
    </AppointmentBlock>
  );
};

export { RepeatingAppointmentsListBlock };
