import { generalSettingsStore } from '@/app';
import { Currency, calculateEndOfWordIdxByNumber, currencyFormatterHelper } from '@/shared';
import { memo, useCallback, useState } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AnalyticsValueType } from '../../models';

const StyledCountUp = styled(CountUp)`
  font-variant: tabular-nums;
`;

interface Props {
  number: number;
  type?: AnalyticsValueType;
}

const CountupComponent = memo((props: Props) => {
  const { number, type = AnalyticsValueType.COUNT } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page',
  });

  const { accountSettings } = generalSettingsStore;

  const [oldNumber, setOldNumber] = useState(0);

  const getDaysSuffix = useCallback(
    (value: number): string => {
      if (value === 1) return `${value} ${t(`days.one_day`)}`;

      const idx = calculateEndOfWordIdxByNumber(value);

      return `${value} ${t(`days.several_days.${idx}`)}`;
    },
    [t]
  );

  return (
    <StyledCountUp
      end={number}
      preserveValue
      duration={0.5}
      start={oldNumber}
      formattingFn={v => {
        if (type === AnalyticsValueType.AMOUNT)
          return currencyFormatterHelper.formatWithLanguage({
            value: v,
            currency: accountSettings?.currency ?? Currency.USD,
            language: accountSettings?.language,
          });

        if (type === AnalyticsValueType.PERCENT) return `${v}%`;

        if (type === AnalyticsValueType.DAYS) return getDaysSuffix(v);

        return String(v);
      }}
      onEnd={() => setOldNumber(number)}
    />
  );
});

CountupComponent.displayName = 'CountupComponent';
export { CountupComponent };
