import { calculateEndOfWordIdxByNumber } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const Label = styled.span`
  color: var(--button-text-graphite-primary-text);
`;

const Text = styled.span`
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  count?: number;
  activities?: boolean;
}

const TasksCount = (props: Props) => {
  const { count, activities } = props;

  const { t } = useTranslation();

  const label = useMemo<string>(() => {
    if (count === undefined) return '';

    const idx = calculateEndOfWordIdxByNumber(count);

    return activities ? t(`activities_total.${idx}`) : t(`tasks_total.${idx}`);
  }, [count, activities, t]);

  if (count === undefined) return null;

  return (
    <Root>
      <Text>{count}</Text>

      <Label>{label}</Label>
    </Root>
  );
};

export { TasksCount };
