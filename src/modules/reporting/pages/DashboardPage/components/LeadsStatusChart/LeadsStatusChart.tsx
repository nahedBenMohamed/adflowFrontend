import { useDisclosure } from '@mantine/hooks';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  AnalyticsColors,
  Block,
  BlockHeader,
  ChartType,
  ViewSwitch,
  type EntitiesReport,
} from '../../../../shared';
import { Column } from './components';

const Chart = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  gap: 16px;
`;

interface Props {
  model: EntitiesReport;
  chartType: ChartType;
}

const title = (chartType: ChartType): string => {
  switch (true) {
    case chartType === ChartType.CANDIDATES:
      return 'title_for_candidates';

    case chartType === ChartType.ORDERS:
      return 'title_for_orders';

    case chartType === ChartType.SALES:
    default:
      return 'title';
  }
};

const subtitle = (chartType: ChartType): string => {
  switch (true) {
    case chartType === ChartType.CANDIDATES:
      return 'subtitle_for_candidates';

    case chartType === ChartType.ORDERS:
      return 'subtitle_for_orders';

    case chartType === ChartType.SALES:
    default:
      return 'subtitle';
  }
};

const secondColumnTitle = (chartType: ChartType): string => {
  switch (true) {
    case chartType === ChartType.CANDIDATES:
      return 'hired_candidates';

    case chartType === ChartType.ORDERS:
      return 'completed';

    case chartType === ChartType.SALES:
    default:
      return 'won';
  }
};

const thirdColumnTitle = (chartType: ChartType): string => {
  switch (true) {
    case chartType === ChartType.CANDIDATES:
      return 'rejected_candidates';

    case chartType === ChartType.ORDERS:
      return 'failed';

    case chartType === ChartType.SALES:
    default:
      return 'lost';
  }
};

const LeadsStatusChart = memo((props: Props) => {
  const {
    model: { win: wonLeads, lost: lostLeads, total: totalLeads },
    chartType,
  } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.leads_status_chart',
  });

  const [isAmount, { toggle }] = useDisclosure(chartType === ChartType.CANDIDATES ? false : true);

  const won = isAmount ? wonLeads.amount : wonLeads.quantity;
  const lost = isAmount ? lostLeads.amount : lostLeads.quantity;
  const opened = isAmount ? totalLeads.amount : totalLeads.quantity;

  const percent = useCallback(
    (leads: number): number => {
      const leadsSum = won + lost + opened;

      return leadsSum > 0 ? Math.round((leads / leadsSum) * 100 * 10) / 10 : 0;
    },
    [won, lost, opened]
  );

  return (
    <Block>
      <BlockHeader
        withMinHeight={false}
        title={t(title(chartType))}
        subtitle={t(subtitle(chartType))}
        hint={chartType === ChartType.SALES ? t('hint') : undefined}
      />

      <Chart>
        <Column
          value={opened}
          title={t('opened')}
          isAmount={isAmount}
          percent={percent(opened)}
          color={AnalyticsColors.BLUE}
        />

        <Column
          value={won}
          isAmount={isAmount}
          percent={percent(won)}
          color={AnalyticsColors.GREEN}
          title={t(secondColumnTitle(chartType))}
        />

        <Column
          value={lost}
          isAmount={isAmount}
          percent={percent(lost)}
          color={AnalyticsColors.RED}
          title={t(thirdColumnTitle(chartType))}
        />
      </Chart>

      {chartType !== ChartType.CANDIDATES && (
        <ViewSwitch
          isActiveAmount={isAmount}
          salesChart={chartType === ChartType.SALES}
          handleChange={toggle}
        />
      )}
    </Block>
  );
});

LeadsStatusChart.displayName = 'LeadsStatusChart';
export { LeadsStatusChart };
