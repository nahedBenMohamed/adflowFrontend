import type { UtcDate } from '@/shared';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;

  color: var(--button-text-graphite-primary-text);
`;

const Label = styled.p`
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
`;

const Date = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
`;

interface Props {
  date: UtcDate;
  label: string;
}

const DateBlock = (props: Props) => {
  const { date, label } = props;

  return (
    <Root>
      <Label>{label}</Label>
      <Date>{date.displayShort()}</Date>
    </Root>
  );
};

export { DateBlock };
