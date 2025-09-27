import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DigitBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 16px;
  height: 20px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  border-radius: 2px;
  background: var(--graphite-graphite-20);
  border: 1px solid var(--graphite-graphite-80);
`;

const Delimiter = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  plannedTimeInSeconds: number;
}

const extractHoursFromSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);

  return hours.toString().padStart(2, '0');
};

const extractMinutesFromSeconds = (seconds: number) => {
  const minutes = Math.floor((seconds % 3600) / 60);

  return minutes.toString().padStart(2, '0');
};

const PlannedTimeBlock = (props: Props) => {
  const { plannedTimeInSeconds } = props;

  const hours = extractHoursFromSeconds(plannedTimeInSeconds);
  const minutes = extractMinutesFromSeconds(plannedTimeInSeconds);

  return (
    <Root>
      <DigitBlock>{hours[0]}</DigitBlock>
      <DigitBlock>{hours[1]}</DigitBlock>

      <Delimiter>:</Delimiter>

      <DigitBlock>{minutes[0]}</DigitBlock>
      <DigitBlock>{minutes[1]}</DigitBlock>
    </Root>
  );
};

export { PlannedTimeBlock };
