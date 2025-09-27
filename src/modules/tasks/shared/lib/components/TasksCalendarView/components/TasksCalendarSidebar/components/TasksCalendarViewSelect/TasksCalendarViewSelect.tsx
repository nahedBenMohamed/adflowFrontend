import { generalSettingsStore } from '@/app';
import {
  CalendarView,
  InputModel,
  MySelect,
  MySwitch,
  MyTimePickerInput,
  TruncateMixin,
  type Option,
  type SelectModel,
  type TimePickerSelectMenuPopoverProps,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { calendarViewStore } from '../../../../../../../../store';

const TimeScaleRoot = styled.div<{ $withGap?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${p => (p.$withGap ? '8px' : '0')};

  padding: 8px 16px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

const SwitchWrapper = styled.div`
  height: 30px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const TimeScaleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const TimePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Text = styled.label`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin};
`;

interface Props {
  viewModel: SelectModel;
  handleChangeView: (value: CalendarView) => void;
}

const TasksCalendarViewSelect = observer((props: Props) => {
  const { viewModel, handleChangeView } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'calendar',
  });

  const timeScaleId = useId();
  const showWeekendsId = useId();

  const {
    showWeekend,
    timeScaleTo,
    timeScaleFrom,
    timeScaleEnabled,
    setTimeScaleTo,
    toggleTimeScale,
    setTimeScaleFrom,
    toggleShowWeekend,
  } = calendarViewStore;

  const views = useMemo<Option<CalendarView>[]>(
    () =>
      Object.values(CalendarView).map(v => ({
        value: v,
        label: t(String(v)),
      })),
    [t]
  );

  const timeScaleForm = useLocalObservable(() => ({
    from: InputModel.create(
      timeScaleFrom ?? generalSettingsStore.accountSettings?.workingTimeFrom ?? '00:00'
    ),
    to: InputModel.create(
      timeScaleTo ?? generalSettingsStore.accountSettings?.workingTimeTo ?? '23:59'
    ),
  }));

  const timePickerDropdownProps = useMemo<TimePickerSelectMenuPopoverProps>(
    () => ({ step: 15, returnFocus: true }),
    []
  );

  return (
    <MySelect
      options={views}
      model={viewModel}
      variant="outlined"
      handleChange={handleChangeView}
      CustomBottomControls={
        <TimeScaleRoot $withGap={timeScaleEnabled}>
          <SwitchWrapper>
            <Text htmlFor={timeScaleId}>{t('time_scale')}</Text>

            <MySwitch inputId={timeScaleId} checked={timeScaleEnabled} onChange={toggleTimeScale} />
          </SwitchWrapper>

          {timeScaleEnabled && (
            <TimeScaleWrapper>
              <TimePickerWrapper>
                <Text>{t('from')}</Text>

                <MyTimePickerInput
                  model={timeScaleForm.from}
                  pickerDropdownProps={timePickerDropdownProps}
                  handleChange={setTimeScaleFrom}
                />
              </TimePickerWrapper>

              <TimePickerWrapper>
                <Text>{t('to')}</Text>

                <MyTimePickerInput
                  model={timeScaleForm.to}
                  pickerDropdownProps={timePickerDropdownProps}
                  handleChange={setTimeScaleTo}
                />
              </TimePickerWrapper>
            </TimeScaleWrapper>
          )}

          <SwitchWrapper>
            <Text htmlFor={showWeekendsId}>{t('show_weekends')}</Text>

            <MySwitch inputId={showWeekendsId} checked={showWeekend} onChange={toggleShowWeekend} />
          </SwitchWrapper>
        </TimeScaleRoot>
      }
    />
  );
});

TasksCalendarViewSelect.displayName = 'TasksCalendarViewSelect';
export { TasksCalendarViewSelect };
