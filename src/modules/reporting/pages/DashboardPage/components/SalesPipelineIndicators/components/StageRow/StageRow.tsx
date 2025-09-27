import { generalSettingsStore } from '@/app';
import {
  ColorUtil,
  Currency,
  TruncateMixin,
  calculateEndOfWordIdxByNumber,
  currencyFormatterHelper,
  getDHMSFromSeconds,
  type Nullable,
} from '@/shared';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AnalyticsValueType, CountupComponent } from '../../../../../../shared';

const Root = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;

  color: var(--button-text-graphite-primary-text);
`;

const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const DaysCount = styled.div`
  width: 56px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const StatisticsLine = styled.div`
  width: 720px;

  display: flex;
  align-items: center;
`;

const PERCENT_BLOCK_MAX_WIDTH = 640;

interface PercentBlockProps {
  $width: number;
  $color: string;
  $bgColor: string;
}

const PercentBlock = styled.div<PercentBlockProps>`
  width: ${p => p.$width}px;
  max-width: ${PERCENT_BLOCK_MAX_WIDTH}px;
  min-width: 48px;

  display: flex;
  align-items: center;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${p => p.$color};

  padding: 4px 16px;
  border-radius: 16px;
  background-color: ${p => p.$bgColor};
  transition: var(--transition-200);
`;

const Line = styled.hr`
  width: 100%;
  height: 1px;

  flex: 1;

  background-color: var(--graphite-graphite-80);
`;

const Value = styled.div`
  flex: 1;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const RightBlock = styled.div`
  width: 240px;

  display: flex;
  align-items: center;
  gap: 12px;
`;

interface CountBlockProps {
  $color: string;
  $bgColor: string;
}

const CountBlock = styled.div<CountBlockProps>`
  width: 48px;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p => p.$color};

  border-radius: 16px;
  background-color: ${p => p.$bgColor};
`;

const StageName = styled.span`
  width: 100%;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  ${TruncateMixin};
`;

interface Props {
  value: number;
  count: number;
  color: string;
  percent: number;
  stageName: string;
  daysCountInSeconds: Nullable<number>;
}

const StageRow = (props: Props) => {
  const { value, count, color, percent, stageName, daysCountInSeconds } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.sales_pipeline_indicators',
  });

  const percentBlockWidth = Math.floor(PERCENT_BLOCK_MAX_WIDTH * percent);

  const { accountSettings } = generalSettingsStore;
  const currency = accountSettings?.currency ?? Currency.USD;

  const formattedValue = useMemo<string>(
    () =>
      currencyFormatterHelper.formatWithLanguage({
        value,
        currency,
        language: accountSettings?.language,
      }),
    [value, currency, accountSettings]
  );

  const getDaysLabel = useCallback((): string => {
    if (daysCountInSeconds === null) return '';

    const { days } = getDHMSFromSeconds(daysCountInSeconds);

    const idx = calculateEndOfWordIdxByNumber(days);

    return `${days} ${t(`days.${idx}`)}`;
  }, [daysCountInSeconds, t]);

  const bgColor = ColorUtil.getProcessedBGColor(color);
  const textColor = ColorUtil.getTextContrastColorByBgColorHex(bgColor);

  return (
    <Root>
      <LeftBlock>
        <DaysCount>{getDaysLabel()}</DaysCount>

        <StatisticsLine>
          <PercentBlock $width={percentBlockWidth} $bgColor={bgColor} $color={textColor}>
            <CountupComponent number={percent * 100} type={AnalyticsValueType.PERCENT} />
          </PercentBlock>

          <Line />
        </StatisticsLine>

        <Value>
          {formattedValue.length > 18 ? (
            currencyFormatterHelper.compactFormat({
              value,
              currency: accountSettings?.currency ?? Currency.USD,
              language: accountSettings?.language,
            })
          ) : (
            <CountupComponent number={value} type={AnalyticsValueType.AMOUNT} />
          )}
        </Value>
      </LeftBlock>

      <RightBlock>
        <CountBlock $bgColor={bgColor} $color={textColor}>
          <CountupComponent number={count} />
        </CountBlock>

        <StageName title={stageName}>{stageName}</StageName>
      </RightBlock>
    </Root>
  );
};

export { StageRow };
