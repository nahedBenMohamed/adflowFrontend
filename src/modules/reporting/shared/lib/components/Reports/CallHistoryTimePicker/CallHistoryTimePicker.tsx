import { InputModel, type SelectModel } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import styled from 'styled-components';
import { Delimiter } from './components';
import { DoubleDigitNumberInput } from './components/DoubleDigitNumberInput/DoubleDigitNumberInput';

const Root = styled.div`
  display: flex;
  padding: 4px 8px;
  align-items: center;
  gap: 4px;
  align-self: stretch;

  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-120);
`;

const InputGroup = styled.div`
  display: flex;
  gap: 4px;
`;

interface Props {
  model: SelectModel;
  handleApply: () => void;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}

const extractMinutesFromSeconds = (seconds: number) => {
  const minutes = Math.floor((seconds % 3600) / 60);

  return minutes.toString().padStart(2, '0');
};

const extractSeconds = (totalSeconds: number) => {
  const seconds = totalSeconds % 60;

  return seconds.toString().padStart(2, '0');
};

const CallHistoryTimePicker = observer((props: Props) => {
  const { model, handleApply, setEnabled } = props;

  const minutes = model.value ? extractMinutesFromSeconds(model.value) : '00';
  const seconds = model.value ? extractSeconds(model.value) : '00';

  const firstPair = useLocalObservable(() => InputModel.create(minutes));
  const secondPair = useLocalObservable(() => InputModel.create(seconds));

  const firstRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const minutes = `${firstPair.value}`;
    const seconds = `${secondPair.value}`;

    const totalSeconds = +minutes * 60 + +seconds;

    if (totalSeconds === model.value) {
      return;
    }

    model.setValue(totalSeconds);
    handleApply();
  }, [firstPair.value, secondPair.value, handleApply, model.value, model]);

  return (
    <Root>
      <InputGroup>
        <DoubleDigitNumberInput
          minified={true}
          ref={firstRef}
          model={firstPair}
          focusToLeft={() => firstRef.current?.focus()}
          focusToRight={() => firstRef.current?.focus()}
          setEnabled={setEnabled}
        />
      </InputGroup>

      <Delimiter>:</Delimiter>

      <InputGroup>
        <DoubleDigitNumberInput
          minified={true}
          ref={secondRef}
          model={secondPair}
          focusToLeft={() => firstRef.current?.focus()}
          focusToRight={() => firstRef.current?.focus()}
          setEnabled={setEnabled}
        />
      </InputGroup>
    </Root>
  );
});

CallHistoryTimePicker.displayName = 'CallHistoryTimePicker';
export { CallHistoryTimePicker };
