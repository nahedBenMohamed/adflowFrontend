import { generalSettingsStore } from '@/app';
import {
  MyDatePickerSelect,
  MySelect,
  MyTimePickerInput,
  TimeFromIcon,
  UtcDate,
  useToggleControl,
  type BusinessHours,
  type InputModel,
  type SelectModel,
  type TimePickerSelectMenuPopoverProps,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ToIcon } from '../../../../../assets';
import { generateTimePeriodOptions } from '../../../../helpers';
import { ScheduleType, type Schedule } from '../../../../models';
import { AppointmentFormItem } from '../AppointmentFormItem/AppointmentFormItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TimeInputsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DelimiterWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Delimiter = styled.hr`
  width: 8px;

  flex-shrink: 0;

  border-top: 1px solid var(--button-text-graphite-primary-text);
`;

const TimePickerInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimePickerLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  day: SelectModel;
  startTime: InputModel;
  endTime: InputModel;
  selectedSchedule: Schedule;
  timePeriodModel: SelectModel;
  businessHours: BusinessHours;
}

const AppointmentDateAndTimeFormItem = observer((props: Props) => {
  const {
    day,
    startTime,
    endTime,
    selectedSchedule: { timePeriod, type },
    timePeriodModel,
    businessHours,
  } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const datePickerSelectControl = useToggleControl(false);

  const { accountSettings } = generalSettingsStore;

  const commonPickerDropdownProps = useMemo(
    () =>
      ({
        step: 15,
        inModal: true,
        withinPortal: true,
        businessHours:
          accountSettings && accountSettings.workingTimeFrom && accountSettings.workingTimeTo
            ? {
                from: accountSettings.workingTimeFrom,
                to: accountSettings.workingTimeTo,
              }
            : undefined,
      }) satisfies TimePickerSelectMenuPopoverProps,
    [accountSettings]
  );

  const timePeriodOptions = timePeriod
    ? generateTimePeriodOptions({
        timePeriod,
        businessHours,
      })
    : [];

  const handleSelectTimePeriod = useCallback(() => {
    if (!timePeriod) return;

    startTime.value = timePeriodModel.value;
    endTime.value = UtcDate.secondsToHoursString(
      UtcDate.parseHoursStringToSeconds(timePeriodModel.value) + timePeriod
    );
  }, [timePeriodModel, timePeriod, startTime, endTime]);

  const handleChangeTime = useCallback(() => {
    if (startTime.value < endTime.value) {
      startTime.clearError();
      endTime.clearError();
    }
  }, [endTime, startTime]);

  return (
    <AppointmentFormItem label={t('date_and_time')} alignItems="flex-start">
      <Wrapper>
        <MyDatePickerSelect
          model={day}
          withinPortal
          type="default"
          opened={datePickerSelectControl.active}
          variant="outlined-without-active-shadow"
          hide={datePickerSelectControl.close}
          show={datePickerSelectControl.open}
        />

        {type === ScheduleType.SCHEDULE ? (
          <TimeInputsWrapper>
            <TimePickerInputWrapper>
              <TimePickerLabelWrapper>
                <IconWrapper>
                  <TimeFromIcon />
                </IconWrapper>

                {t('from')}
              </TimePickerLabelWrapper>

              <MyTimePickerInput
                model={startTime}
                pickerDropdownProps={commonPickerDropdownProps}
                handleChange={handleChangeTime}
              />
            </TimePickerInputWrapper>

            <DelimiterWrapper>
              <Delimiter />
            </DelimiterWrapper>

            <TimePickerInputWrapper>
              <TimePickerLabelWrapper>
                <IconWrapper>
                  <ToIcon />
                </IconWrapper>

                {t('to')}
              </TimePickerLabelWrapper>

              <MyTimePickerInput
                model={endTime}
                pickerDropdownProps={commonPickerDropdownProps}
                handleChange={handleChangeTime}
              />
            </TimePickerInputWrapper>
          </TimeInputsWrapper>
        ) : (
          <MySelect
            withinPortal
            model={timePeriodModel}
            options={timePeriodOptions}
            variant="outlined-without-active-shadow"
            placeholder={t('placeholders.select_time_period')}
            handleChange={handleSelectTimePeriod}
          />
        )}
      </Wrapper>
    </AppointmentFormItem>
  );
});

AppointmentDateAndTimeFormItem.displayName = 'AppointmentDateAndTimeFormItem';
export { AppointmentDateAndTimeFormItem };
