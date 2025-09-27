import { generalSettingsStore } from '@/app';
import { Currency, TruncateMixin, currencyFormatterHelper, type Optional } from '@/shared';
import { memo, useMemo } from 'react';
import styled from 'styled-components';
import {
  AnalyticsValueType,
  CountupComponent,
  LeadsStatusChartPalette,
  type AnalyticsColors,
} from '../../../../../../shared';

const Root = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1 0 0;
  gap: 16px;

  ${TruncateMixin}
`;

const ColumnWithData = styled.div`
  position: relative;

  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;

  ${TruncateMixin}
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;

  padding: 0 16px;
`;

const Percent = styled.div`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);
`;

const Value = styled.div`
  width: 100%;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

interface ColorColumnProps {
  $height: number;
  $color: AnalyticsColors;
}

const ColorColumn = styled.div<ColorColumnProps>`
  width: 100%;
  height: ${p => p.$height}%;

  align-items: flex-start;

  border-radius: 8px 8px 0px 0px;
  background-color: ${p => LeadsStatusChartPalette[p.$color]};
  transition: var(--transition-200);
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: 600;
  line-height: 17px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  title: string;
  value: number;
  percent: number;
  color: AnalyticsColors;
  isAmount: boolean;
}

const Column = memo((props: Props) => {
  const { title, value, percent, color, isAmount } = props;

  const { accountSettings } = generalSettingsStore;

  const formattedAmount = useMemo<Optional<string>>(
    () =>
      isAmount
        ? currencyFormatterHelper.formatWithLanguage({
            value,
            currency: accountSettings?.currency ?? Currency.USD,
            language: accountSettings?.language,
          })
        : undefined,
    [isAmount, value, accountSettings]
  );

  const currency = accountSettings?.currency ?? Currency.USD;

  return (
    <Root>
      <ColumnWithData>
        <Wrapper>
          <Percent>
            <CountupComponent number={percent} type={AnalyticsValueType.PERCENT} />
          </Percent>

          <ColorColumn $color={color} $height={percent} />
        </Wrapper>

        <Value title={currencyFormatterHelper.format({ value, currency })}>
          {formattedAmount && formattedAmount.length > 13 ? (
            currencyFormatterHelper.compactFormat({
              value,
              currency,
              language: accountSettings?.language,
            })
          ) : (
            <CountupComponent
              number={value}
              type={isAmount ? AnalyticsValueType.AMOUNT : AnalyticsValueType.COUNT}
            />
          )}
        </Value>
      </ColumnWithData>

      <Title>{title}</Title>
    </Root>
  );
});

Column.displayName = 'Column';
export { Column };
