import { InputModel, type Nullable } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { PlannedTimeNumberInput } from './components';

interface RootProps {
  $minified: boolean;
  $disabled?: boolean;
}

const Root = styled.div<RootProps>`
  display: flex;
  align-items: center;
  gap: ${p => (p.$minified ? 4 : 8)}px;

  ${p => p.$disabled && `pointer-events: none`};
`;

const InputGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const Delimiter = styled.span<{ $minified: boolean }>`
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: var(--button-text-graphite-secondary-text);

  ${p =>
    p.$minified &&
    css`
      font-size: 14px;
      line-height: 20px;
    `}
`;

const extractHoursFromSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);

  return hours.toString().padStart(2, '0');
};

const extractMinutesFromSeconds = (seconds: number) => {
  const minutes = Math.floor((seconds % 3600) / 60);

  return minutes.toString().padStart(2, '0');
};

interface Props {
  defaultValue?: Nullable<number>;
  minified?: boolean;
  disabled?: boolean;
  changeValue: (value: number) => void;
}

const PlannedTimePicker = observer((props: Props) => {
  const { defaultValue = null, minified = false, disabled, changeValue } = props;

  const hours = defaultValue ? extractHoursFromSeconds(defaultValue) : '00';
  const minutes = defaultValue ? extractMinutesFromSeconds(defaultValue) : '00';

  const firstDigit = useLocalObservable(() => InputModel.create(hours[0]));
  const secondDigit = useLocalObservable(() => InputModel.create(hours[1]));
  const thirdDigit = useLocalObservable(() => InputModel.create(minutes[0]));
  const fourthDigit = useLocalObservable(() => InputModel.create(minutes[1]));

  useEffect(() => {
    firstDigit.setValue(hours[0] ?? '');
    secondDigit.setValue(hours[1] ?? '');
    thirdDigit.setValue(minutes[0] ?? '');
    fourthDigit.setValue(minutes[1] ?? '');
  }, [hours, minutes, firstDigit, secondDigit, thirdDigit, fourthDigit]);

  const firstRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const thirdRef = useRef<HTMLInputElement>(null);
  const fourthRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(() => {
    const hours = `${firstDigit.value}${secondDigit.value}`;
    const minutes = `${thirdDigit.value}${fourthDigit.value}`;

    const totalSeconds = +hours * 3600 + +minutes * 60;

    if (totalSeconds === defaultValue) return;

    changeValue(totalSeconds);
  }, [
    defaultValue,
    firstDigit.value,
    secondDigit.value,
    thirdDigit.value,
    fourthDigit.value,
    changeValue,
  ]);

  const getFocusHandler = useCallback(
    (number: 'first' | 'second' | 'third' | 'fourth') => () => {
      switch (number) {
        case 'first': {
          firstRef.current?.focus();

          break;
        }

        case 'second': {
          secondRef.current?.focus();

          break;
        }

        case 'third': {
          thirdRef.current?.focus();

          break;
        }

        case 'fourth': {
          fourthRef.current?.focus();

          break;
        }
      }
    },
    []
  );

  return (
    <Root $minified={minified} $disabled={disabled}>
      <InputGroup>
        <PlannedTimeNumberInput
          ref={firstRef}
          model={firstDigit}
          minified={minified}
          handleChange={handleChange}
          focusToLeft={getFocusHandler('fourth')}
          focusToRight={getFocusHandler('second')}
        />

        <PlannedTimeNumberInput
          ref={secondRef}
          model={secondDigit}
          minified={minified}
          handleChange={handleChange}
          focusToLeft={getFocusHandler('first')}
          focusToRight={getFocusHandler('third')}
        />
      </InputGroup>

      <Delimiter $minified={minified}>:</Delimiter>

      <InputGroup>
        <PlannedTimeNumberInput
          ref={thirdRef}
          model={thirdDigit}
          minutesFirstDigit
          minified={minified}
          handleChange={handleChange}
          focusToLeft={getFocusHandler('second')}
          focusToRight={getFocusHandler('fourth')}
        />

        <PlannedTimeNumberInput
          ref={fourthRef}
          model={fourthDigit}
          canGoRight={false}
          minified={minified}
          handleChange={handleChange}
          focusToLeft={getFocusHandler('third')}
          focusToRight={getFocusHandler('first')}
        />
      </InputGroup>
    </Root>
  );
});

PlannedTimePicker.displayName = 'PlannedTimePicker';
export { PlannedTimePicker };
