import { Label, MyInputNumber, MySelect, type Option, type UtcDate } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetRepeatingAppointmentsDatesDisplay,
  useGetRepeatingAppointmentsIntervalOptions,
} from '../../../../hooks';
import type { RepeatingAppointmentsParameters } from '../../../../models';
import { RepeatingAppointmentInterval } from '../../../../types';
import { AppointmentBlock } from '../AppointmentBlock/AppointmentBlock';
import { AppointmentFormItem } from '../AppointmentFormItem/AppointmentFormItem';

interface Props {
  parameters: RepeatingAppointmentsParameters;
  startDate: UtcDate;
  endDate: UtcDate;
}

const RepeatingAppointmentsIntervalBlock = observer((props: Props) => {
  const { parameters, startDate, endDate } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal.repeating_appointments_block',
  });

  const intervalOptions = useGetRepeatingAppointmentsIntervalOptions();

  const repeatingAppointmentsEnabled =
    parameters.interval.value !== RepeatingAppointmentInterval.NONE;
  const appointmentsDatesForDisplay = useGetRepeatingAppointmentsDatesDisplay({
    visits: parameters.repeatingAppointmentsByIntervalStartDates({ startDate, endDate }),
    interval: parameters.interval.value,
  });

  const handleChangeInterval = useCallback(
    (interval: Option<RepeatingAppointmentInterval>) => {
      if (interval.value === RepeatingAppointmentInterval.NONE) {
        parameters.count.setValue(0);
      } else if (parameters.count.valueOrZero === 0) {
        parameters.count.setValue(1);
      }
    },
    [parameters.count]
  );

  return (
    <AppointmentBlock headerTitle={t('header')} hint={t('hint')}>
      <AppointmentFormItem label={t('interval')}>
        <MySelect
          withinPortal
          options={intervalOptions}
          model={parameters.interval}
          variant="outlined-without-active-shadow"
          handleChangeOption={handleChangeInterval}
        />
      </AppointmentFormItem>

      <AppointmentFormItem label={t('count')}>
        <MyInputNumber
          min={1}
          max={50}
          variant="outlined"
          model={parameters.count}
          disabled={!repeatingAppointmentsEnabled}
        />
      </AppointmentFormItem>

      {repeatingAppointmentsEnabled && parameters.count.valueOrZero > 0 && (
        <Label $noEllipsis $color="var(--button-text-graphite-primary-text)">
          {appointmentsDatesForDisplay}
        </Label>
      )}
    </AppointmentBlock>
  );
});

RepeatingAppointmentsIntervalBlock.displayName = 'RepeatingAppointmentsIntervalBlock';
export { RepeatingAppointmentsIntervalBlock };
