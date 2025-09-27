import { memo, useMemo } from 'react';
import styled from 'styled-components';
import { REPORT_TABLE_DATA_CURRENT } from '../../../../../templates';

const Root = styled.p`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  b {
    font-weight: 600;
  }

  span {
    font-weight: 400;
  }
`;

const CurrentIndicator = styled.span`
  width: 10px;
  height: 10px;

  flex-shrink: 0;

  border-radius: 50%;
  background-color: var(--primary-statuses-green-520);
`;

interface Props {
  title: string;
  current?: boolean;
  additionalDate?: string;
}

const ComparativeCompositeHeader = memo((props: Props) => {
  const { title, current, additionalDate } = props;

  const dataAttributes = useMemo<Record<string, unknown>>(
    () => (current ? { [REPORT_TABLE_DATA_CURRENT]: true } : {}),
    [current]
  );

  return (
    <Root {...dataAttributes}>
      {current && <CurrentIndicator />}

      <b>{title}</b>

      {additionalDate && <span>{additionalDate}</span>}
    </Root>
  );
});

export { ComparativeCompositeHeader };
