import { generalSettingsStore } from '@/app';
import {
  DeleteButton,
  MyTimePickerInput,
  type MyTimePickerInputProps,
  PlusIconButton,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { WeekDays, type WeekIntervalListModel } from '../../../models';

const Root = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > div:not(:last-child) {
    border-bottom: 0.5px solid var(--graphite-graphite-80);
  }

  ${p =>
    p.$disabled &&
    css`
      opacity: 0.7;

      pointer-events: none;
    `}
`;

const WeekDayWrapper = styled.div`
  display: flex;
  gap: 16px;

  padding-bottom: 8px;
`;

const WeekDayLabel = styled.div`
  width: 56px;

  flex-shrink: 0;

  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  text-transform: uppercase;
  letter-spacing: -0.0125em;
  color: var(--button-text-graphite-primary-text);

  padding-top: 5px;
`;

const IntervalsList = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const IntervalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonPlaceholder = styled.div`
  width: 16px;
  height: 100%;
  flex-shrink: 0;
`;

const WorkingTimePickerWrapper = styled.div`
  width: calc(100% - 8px - 20px - 12px - 20px);

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
`;

const Bulkhead = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: var(--button-text-graphite-primary-text);
`;

const UnavailableLabel = styled.span`
  height: 28px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding-top: 5px;
`;

interface Props {
  model: WeekIntervalListModel;
  disabled?: boolean;
}

const WeekIntervalsInput = observer((props: Props) => {
  const { model, disabled } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'form.week_intervals_input',
  });

  const weekDays = useMemo<WeekDays[]>(() => {
    const days = Object.values(WeekDays);
    const startIndex = days.indexOf(
      generalSettingsStore.accountSettings?.startOfWeek ?? WeekDays.MONDAY
    );

    return [...days.slice(startIndex), ...days.slice(0, startIndex)];
  }, []);

  const pickerDropdownProps = useMemo<MyTimePickerInputProps['pickerDropdownProps']>(
    () => ({
      step: 30,
      inModal: true,
      withinPortal: true,
      position: 'bottom-start',
    }),
    []
  );

  return (
    <Root $disabled={disabled}>
      {weekDays.map(dayOfWeek => (
        <WeekDayWrapper key={dayOfWeek}>
          <WeekDayLabel>{t(dayOfWeek.slice(0, 2).toLowerCase())}</WeekDayLabel>

          <IntervalsList>
            {model.hasIntervals(dayOfWeek) ? (
              model.getByDayOfWeek(dayOfWeek).map((i, idx, arr) => (
                <IntervalWrapper key={i.id}>
                  <WorkingTimePickerWrapper>
                    <MyTimePickerInput
                      fullWidth
                      pickerDropdownProps={pickerDropdownProps}
                      model={i.timeFrom}
                    />

                    <Bulkhead>{t('to')}</Bulkhead>

                    <MyTimePickerInput
                      fullWidth
                      pickerDropdownProps={pickerDropdownProps}
                      model={i.timeTo}
                    />
                  </WorkingTimePickerWrapper>

                  <ButtonsWrapper>
                    <DeleteButton onClick={() => model.remove(i.id)} />

                    {idx === arr.length - 1 && !(arr.length >= 5) ? (
                      <PlusIconButton isGreen onClick={() => model.add(dayOfWeek)} />
                    ) : (
                      <ButtonPlaceholder />
                    )}
                  </ButtonsWrapper>
                </IntervalWrapper>
              ))
            ) : (
              <IntervalWrapper>
                <UnavailableLabel>{t('unavailable')}</UnavailableLabel>

                <PlusIconButton isGreen onClick={() => model.add(dayOfWeek)} />
              </IntervalWrapper>
            )}
          </IntervalsList>
        </WeekDayWrapper>
      ))}
    </Root>
  );
});

WeekIntervalsInput.displayName = 'WeekIntervalsInput';
export { WeekIntervalsInput };
