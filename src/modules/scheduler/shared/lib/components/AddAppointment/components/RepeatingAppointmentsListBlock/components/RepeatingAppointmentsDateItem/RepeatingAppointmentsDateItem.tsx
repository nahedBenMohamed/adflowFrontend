import { generalSettingsStore } from '@/app';
import {
  DeleteButton,
  MyDatePicker,
  UtcDate,
  generateMyDatePickerTitle,
  type UtcDateValue,
} from '@/shared';
import { Accordion } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { RepeatingAppointmentsParameters } from '../../../../../../models';
import type { RepeatingAppointmentDateValue } from '../../../../../../types';

const Title = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const ControlWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .workspace__DeleteButton--Root {
    scale: 0;
    opacity: 0;
  }

  &:hover {
    .workspace__DeleteButton--Root {
      scale: 1;
      opacity: 1;
    }
  }
`;

const DatePickerWrapper = styled.div`
  height: fit-content;
  width: fit-content;

  overflow: hidden;
`;

interface Props {
  startDate: UtcDate;
  appointment: RepeatingAppointmentDateValue;
  parameters: RepeatingAppointmentsParameters;
  onDelete: () => void;
}

const RepeatingAppointmentsDateItem = observer((props: Props) => {
  const { parameters, appointment, startDate, onDelete } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal.repeating_appointments_block.list',
  });

  const handleChange = useCallback(
    (date: UtcDateValue) => {
      parameters.changeAppointmentDate({ id: appointment.id, newDate: date });
    },
    [appointment.id, parameters]
  );

  const excludeDate = useCallback(
    (date: Date): boolean => {
      const utcDate = UtcDate.fromDate(date);

      const isAlreadySelected = parameters.selectedAppointmentsDays.some(a => utcDate.isSameDay(a));

      const isCurrentSelected = appointment.value && utcDate.isSameDay(appointment.value);

      const isNonWorkingDay =
        generalSettingsStore.nonWorkingDaysAsNumberArray?.includes(utcDate.dayOfWeek) ?? false;

      return (
        utcDate.isBeforeOrEqual(startDate) ||
        isNonWorkingDay ||
        (isAlreadySelected && !isCurrentSelected)
      );
    },
    [appointment.value, parameters.selectedAppointmentsDays, startDate]
  );

  return (
    <Accordion.Item value={appointment.id}>
      <ControlWrapper>
        <Accordion.Control>
          <Title>{generateMyDatePickerTitle(appointment.value) ?? t('new_appointment')}</Title>
        </Accordion.Control>

        <DeleteButton size="small" onClick={onDelete} />
      </ControlWrapper>

      <Accordion.Panel key={String(appointment)}>
        <DatePickerWrapper>
          <MyDatePicker
            value={appointment.value}
            excludeDate={excludeDate}
            onChange={handleChange}
          />
        </DatePickerWrapper>
      </Accordion.Panel>
    </Accordion.Item>
  );
});

RepeatingAppointmentsDateItem.displayName = 'RepeatingAppointmentsDateItem';
export { RepeatingAppointmentsDateItem };
