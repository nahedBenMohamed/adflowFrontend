import { generalSettingsStore } from '@/app';
import { Currency, currencyFormatterHelper } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { ArrowIcon, SpeedometerIcon, SpeedometerPlugIcon } from '../../../assets';
import { calculatePercent, convertPercentToAngle } from '../../helpers';
import { AnalyticsValueType, ChartType, type SalesGoalModel } from '../../models';
import { BlockHeader } from '../BlockHeader/BlockHeader';
import { ChartPlug } from '../ChartPlug/ChartPlug';
import { CountupComponent } from '../CountupComponent/CountupComponent';
import { ViewSwitch } from '../ViewSwitch/ViewSwitch';

const SpeedometerBody = styled.div`
  position: relative;

  width: 224px;
  height: 224px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

const ScaleMarks = styled.div`
  position: absolute;
  bottom: 2px;
  left: 50%;

  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 8px;

  transform: translateX(-50%);
`;

const Mark = styled.span<{ $max?: boolean }>`
  width: 40px;

  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  color: ${p => (p.$max ? '#80D747' : '#ED6D5A')};
  text-align: ${p => (p.$max ? 'left' : 'right')};
`;

const Splitter = styled.hr`
  height: 14px;

  border-radius: 2px;
  border: 1px solid var(--graphite-graphite-200);
`;

const CircleStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
`;

const OuterCircle = styled.div`
  width: 160px;
  height: 160px;

  background-color: rgba(248, 101, 79, 0.12);
  border: 1px solid rgba(248, 101, 79, 0.24);

  ${CircleStyles}
`;

const InnerCircle = styled.div`
  width: 133px;
  height: 133px;

  background-color: var(--primary-statuses-white-0);
  outline: 1px solid rgba(248, 101, 79, 0.24);

  ${CircleStyles}
`;

const Content = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: var(--button-text-graphite-primary-text);
`;

const Arrow = styled.div<{ $angle: number }>`
  position: absolute;

  width: 232px;

  border-radius: var(--border-radius-element);
  display: flex;

  transform: ${p => `rotate(${p.$angle - 64}deg)`};

  transition: var(--transition-200);

  svg {
    margin-left: 25px;
    transform: rotate(-55deg);
  }
`;

const CircleIndicator = styled.div<{ $color: SpeedometerColors }>`
  width: 16px;
  height: 16px;

  background-color: var(--primary-statuses-white-0);
  border: ${p => `2px solid ${p.$color}`};
  border-radius: 50%;
`;

const Amount = styled.span`
  display: flex;
  flex-direction: column;

  text-align: center;
  font-size: 18px;
  font-weight: 700;
  line-height: 29px;
  color: var(--button-text-graphite-primary-text);
`;

const CurrentValueWrapper = styled.div`
  flex: 1 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
`;

enum SpeedometerColors {
  GREEN = '#80D747',
  YELLOW = '#E4CD3A',
  RED = '#ED6D5A',
}

interface Props {
  model: SalesGoalModel;
  withHint?: boolean;
  chartType: ChartType;
}

const indicatorColor = (angle: number): SpeedometerColors => {
  switch (true) {
    case angle > 206:
      return SpeedometerColors.GREEN;

    case angle > 100:
      return SpeedometerColors.YELLOW;

    default:
      return SpeedometerColors.RED;
  }
};

const Speedometer = observer((props: Props) => {
  const {
    model: { amount, quantity },
    withHint = false,
    chartType,
  } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.sales_goal_chart',
  });

  const { accountSettings } = generalSettingsStore;

  const [isAmount, { toggle }] = useDisclosure(chartType === ChartType.CANDIDATES ? false : true);

  const currentValue = isAmount ? amount.current : quantity.current;
  const goalValue = isAmount ? amount.goal : quantity.goal;
  const percent =
    currentValue === 0 ? 0 : calculatePercent({ currentValue, totalValue: goalValue });
  const angle = convertPercentToAngle({ percent, totalDegrees: 300 });

  const hiddenPlug = Boolean(isAmount ? amount.goal > 0 : quantity.goal > 0);

  return (
    <>
      <BlockHeader
        title={chartType === ChartType.SALES ? t('title_for_sales') : t('title')}
        subtitle={
          hiddenPlug
            ? isAmount
              ? currencyFormatterHelper.format({
                  value: goalValue,
                  currency: accountSettings?.currency ?? Currency.USD,
                })
              : String(goalValue)
            : undefined
        }
        hint={withHint && chartType === ChartType.SALES ? t('hint') : undefined}
      />

      {hiddenPlug ? (
        <>
          <SpeedometerBody>
            <IconWrapper>
              <SpeedometerIcon />
            </IconWrapper>

            <ScaleMarks>
              <Mark>0%</Mark>
              <Splitter />
              <Mark $max>100%</Mark>
            </ScaleMarks>

            <Arrow $angle={angle}>
              <CircleIndicator $color={indicatorColor(angle)} />
              <ArrowIcon />
            </Arrow>

            <OuterCircle>
              <InnerCircle>
                <Content>
                  <CountupComponent number={percent} type={AnalyticsValueType.PERCENT} />
                </Content>
              </InnerCircle>
            </OuterCircle>
          </SpeedometerBody>

          <CurrentValueWrapper>
            <Amount>
              <CountupComponent
                number={currentValue}
                type={isAmount ? AnalyticsValueType.AMOUNT : AnalyticsValueType.COUNT}
              />
            </Amount>
          </CurrentValueWrapper>
        </>
      ) : (
        <ChartPlug
          icon={<SpeedometerPlugIcon />}
          text={chartType === ChartType.SALES ? t('plug_text_for_sales') : t('plug_text')}
        />
      )}

      {chartType !== ChartType.CANDIDATES && (
        <ViewSwitch
          isActiveAmount={isAmount}
          salesChart={chartType === ChartType.SALES}
          handleChange={toggle}
        />
      )}
    </>
  );
});

Speedometer.displayName = 'Speedometer';
export { Speedometer };
