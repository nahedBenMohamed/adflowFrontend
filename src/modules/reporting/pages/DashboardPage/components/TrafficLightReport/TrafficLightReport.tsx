import { useDisclosure } from '@mantine/hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  AnalyticsValueType,
  Block,
  BlockHeader,
  ChartPlug,
  CountupComponent,
  TrafficLightColors,
  TrafficLightPlugIcon,
  ViewSwitch,
  calculatePercent,
  type SalesPlanReportModel,
  type TrafficLightColorStyles,
} from '../../../../shared';

const TrafficLight = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const CircleStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
`;

const OuterCircle = styled.div<{ $color: TrafficLightColors }>`
  width: 224px;
  height: 224px;

  background: ${p => TrafficLightPalette[p.$color].secondary};
  border: ${p => `2px solid ${TrafficLightPalette[p.$color].border}`};

  transition: var(--transition-200);

  ${CircleStyles}
`;

const MiddleCircle = styled.div<{ $color: TrafficLightColors }>`
  width: 205px;
  height: 205px;

  background: var(--primary-statuses-white-0);
  outline: ${p => `2px solid ${TrafficLightPalette[p.$color].border}`};

  transition: var(--transition-200);

  ${CircleStyles}
`;

const InnerCircle = styled.div<{ $color: TrafficLightColors }>`
  width: 160px;
  height: 160px;

  text-align: center;
  font-size: 36px;
  font-weight: 700;
  line-height: 43px;
  color: var(--primary-statuses-white-0);

  background: ${p => TrafficLightPalette[p.$color].main};

  transition: var(--transition-200);
  pointer-events: none;

  ${CircleStyles}
`;

const TrafficLightPalette: Record<TrafficLightColors, TrafficLightColorStyles> = {
  [TrafficLightColors.GREEN]: {
    main: 'var(--primary-statuses-green-520)',
    secondary: 'rgba(105, 210, 34, 0.12)',
    border: 'rgba(105, 210, 34, 0.24)',
  },
  [TrafficLightColors.YELLOW]: {
    main: 'var(--primary-statuses-yellow-400)',
    secondary: 'rgba(251, 212, 55, 0.12)',
    border: 'rgba(251, 212, 55, 0.24)',
  },
  [TrafficLightColors.RED]: {
    main: 'var(--primary-statuses-red-360)',
    secondary: 'rgba(248, 101, 79, 0.12)',
    border: 'rgba(248, 101, 79, 0.24)',
  },
};

const initialSalesPlan: SalesPlanReportModel = {
  amount: {
    current: 0,
    plannedToday: 0,
    plannedTotal: 0,
  },
  quantity: {
    current: 0,
    plannedToday: 0,
    plannedTotal: 0,
  },
};

interface Props {
  salesPlanReport?: SalesPlanReportModel;
}

const getColor = (percent: number): TrafficLightColors => {
  switch (true) {
    case percent === 100:
      return TrafficLightColors.GREEN;

    case percent >= 80:
      return TrafficLightColors.YELLOW;

    default:
      return TrafficLightColors.RED;
  }
};

const TrafficLightReport = (props: Props) => {
  const { salesPlanReport } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.traffic_light_report',
  });

  const { amount, quantity } = salesPlanReport ?? initialSalesPlan;

  const [isAmount, { toggle }] = useDisclosure(true);

  const currentValue = isAmount ? amount.current : quantity.current;
  const goalValue = isAmount ? amount.plannedToday : quantity.plannedToday;
  const percent =
    currentValue === 0 ? 0 : calculatePercent({ currentValue, totalValue: goalValue });

  const color = useMemo(() => getColor(percent), [percent]);

  const hiddenPlug = Boolean(isAmount ? amount.plannedToday : quantity.plannedToday);

  return (
    <Block>
      <BlockHeader
        title={t('title')}
        subtitle={t('subtitle')}
        hint={
          <>
            <span>{t('hint.line1')}</span>
            <span>{t('hint.line2')}</span>
            <span>{t('hint.line3')}</span>
            <ul>
              <li>{t('hint.list.point1')}</li>
              <li>{t('hint.list.point2')}</li>
            </ul>
            <span>{t('hint.line4')}</span>
            <span>{t('hint.line5')}</span>
            <span>{t('hint.line6')}</span>
            <span>{t('hint.line7')}</span>
            <span>{t('hint.line8')}</span>
            <span>{t('hint.line9')}</span>
            <span>{t('hint.line10')}</span>
          </>
        }
      />
      <TrafficLight>
        {hiddenPlug ? (
          <OuterCircle $color={color}>
            <MiddleCircle $color={color}>
              <InnerCircle $color={color}>
                <CountupComponent number={percent} type={AnalyticsValueType.PERCENT} />
              </InnerCircle>
            </MiddleCircle>
          </OuterCircle>
        ) : (
          <ChartPlug icon={<TrafficLightPlugIcon />} text={t('plug_text')} />
        )}

        <ViewSwitch isActiveAmount={isAmount} handleChange={toggle} />
      </TrafficLight>
    </Block>
  );
};

export { TrafficLightReport };
