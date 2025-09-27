import { ControlButton, ConvertTimeUtil, NumberModel, type Nullable } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { IntervalInput, SubmitIntervalButton } from './components';

const Root = styled.div<{ $column?: boolean }>`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  ${p =>
    p.$column &&
    css`
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 12px;
    `}
`;

const Delimiter = styled.hr`
  width: 100%;

  border-top: 1px solid var(--graphite-graphite-80);
`;

const ControlButtonWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-end;
  gap: 4px;
`;

const IntervalsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface Props {
  value: Nullable<number>;
  hideMinutes?: boolean;
  columnVariant?: boolean;
  intervalInputFullWidth?: boolean;
  onChange: (value: Nullable<number>) => void;
}

interface InitialForm {
  days: NumberModel;
  hours: NumberModel;
  minutes: NumberModel;
}

const CustomIntervalInputGroup = observer((props: Props) => {
  const { value, hideMinutes, columnVariant, intervalInputFullWidth, onChange } = props;

  const { t } = useTranslation();

  const intervals = value ? ConvertTimeUtil.getDHMSFromSeconds(value) : null;

  const form = useLocalObservable<InitialForm>(() => ({
    days: NumberModel.create(intervals?.days),
    hours: NumberModel.create(intervals?.hours),
    minutes: NumberModel.create(intervals?.minutes),
  }));

  const daysSeconds = form.days.value ? form.days.value * ConvertTimeUtil.secondsInDay : 0;

  const hoursSeconds = form.hours.value ? form.hours.value * ConvertTimeUtil.secondsInHour : 0;
  const minutesSeconds = form.minutes.value
    ? form.minutes.value * ConvertTimeUtil.secondsInMinute
    : 0;

  const seconds = daysSeconds + hoursSeconds + minutesSeconds;

  const handleSave = () => {
    // max -> 999 days
    onChange(Math.min(seconds, ConvertTimeUtil.getSecondsInDays(999)));
  };

  const handleCancel = () => {
    form.days = NumberModel.create();
    form.hours = NumberModel.create();
    form.minutes = NumberModel.create();

    onChange(null);
  };

  const intervalInputWidth = intervalInputFullWidth ? '100%' : '88px';

  const buttonDisabled = daysSeconds < 0 || hoursSeconds < 0 || minutesSeconds < 0 || seconds === 0;

  return (
    <Root $column={columnVariant}>
      {columnVariant && <Delimiter />}

      <IntervalsWrapper>
        <IntervalInput width={intervalInputWidth} model={form.days} unit={t('day_char')} />

        <IntervalInput width={intervalInputWidth} model={form.hours} unit={t('hour_char')} />

        {!hideMinutes && (
          <IntervalInput width={intervalInputWidth} model={form.minutes} unit={t('minute_char')} />
        )}
      </IntervalsWrapper>

      {columnVariant ? (
        <ControlButtonWrapper>
          <ControlButton variant="cancel" onClick={handleCancel}>
            {t('buttons.cancel')}
          </ControlButton>

          <ControlButton disabled={buttonDisabled} variant="save" onClick={handleSave}>
            {t('buttons.save')}
          </ControlButton>
        </ControlButtonWrapper>
      ) : (
        <SubmitIntervalButton disabled={buttonDisabled} type="button" onClick={handleSave}>
          {t('buttons.save')}
        </SubmitIntervalButton>
      )}
    </Root>
  );
});

CustomIntervalInputGroup.displayName = 'CustomIntervalInputGroup';
export { CustomIntervalInputGroup };
