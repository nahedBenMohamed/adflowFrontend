import { userStore } from '@/app';
import { AvatarUtil, envUtil } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { observer } from 'mobx-react-lite';
import { Doughnut, Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Block,
  BlockHeader,
  ChartPlug,
  ChartType,
  PiePlugIcon,
  ViewSwitch,
  getDoughnutData,
  getDoughnutOptions,
  getPieData,
  getPieOptions,
  htmlLegendPlugin,
  type TopSellerData,
  type TopSellers,
  type TopSellersWithOthers,
} from '../../../../shared';

ChartJS.register(ArcElement, Tooltip, Legend);

const Content = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const PieWrapper = styled.div`
  position: absolute;
  top: 32px;
  left: 50%;

  width: 160px;
  height: 160px;

  transform: translateX(-50%);
`;

const DoughnutWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 50%;

  width: 226px;
  height: 226px;

  border-radius: 50%;
  overflow: hidden;
  transform: translateX(-50%);
`;

const Circle = styled.div`
  position: absolute;
  top: 92px;
  left: 170px;

  width: 40px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #7d89a1;

  border-radius: 50%;
  background-color: var(--primary-statuses-white-0);

  pointer-events: none;
`;

const LegendContainer = styled.div`
  width: 100%;

  align-self: flex-end;
`;

const LegendList = styled.ul`
  max-width: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

interface Props {
  topSellers?: TopSellers;
  chartType: ChartType;
}

const title = (chartType: ChartType): string => {
  switch (true) {
    case chartType === ChartType.ORDERS:
    case chartType === ChartType.CANDIDATES:
      return 'title';

    case chartType === ChartType.SALES:
    default:
      return 'title_for_sales';
  }
};

const plugText = (chartType: ChartType): string => {
  switch (true) {
    case chartType === ChartType.ORDERS:
      return 'plug_text_for_orders';

    case chartType === ChartType.CANDIDATES:
      return 'plug_text_for_candidates';

    case chartType === ChartType.SALES:
    default:
      return 'plug_text';
  }
};

const TopSellersChart = observer((props: Props) => {
  const { topSellers, chartType } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.top_sellers',
  });

  const [isAmount, { toggle }] = useDisclosure(chartType === ChartType.CANDIDATES ? false : true);

  const sortedTopSellers: TopSellersWithOthers[] = topSellers
    ? [
        ...topSellers.users.sort((a, b) =>
          isAmount ? b.amount - a.amount : b.quantity - a.quantity
        ),
        { ...topSellers.others, userId: null },
      ]
    : [];

  const total = isAmount ? topSellers?.total.amount : topSellers?.total.quantity;

  const sortedTopSellersData = sortedTopSellers
    .filter(sts => (isAmount ? sts.amount : sts.quantity))
    .map<TopSellerData>(sts => {
      const user = sts.userId ? userStore.getActiveById(sts.userId) : null;

      return {
        avatar: user ? user.avatarUrl : null,
        initials: user ? AvatarUtil.extractInitials(user.firstName, user.lastName) : null,
        userName: user ? user.fullName : t('others'),
        percent: total ? Math.round(((isAmount ? sts.amount : sts.quantity) * 100) / total) : 0,
        value: isAmount ? sts.amount : sts.quantity,
      };
    });

  const doughnutData = getDoughnutData(sortedTopSellersData);
  const doughnutOptions = getDoughnutOptions(isAmount);

  const pieData: ChartData<'pie'> = getPieData(sortedTopSellersData);
  const pieOptions: ChartOptions<'pie'> = getPieOptions(isAmount);

  const hiddenPlug = Boolean(
    topSellers &&
      topSellers.users.length &&
      topSellers.users.some(u => (isAmount ? u.amount > 0 : u.quantity > 0))
  );

  return (
    <Block>
      <BlockHeader
        title={t(title(chartType))}
        hint={chartType === ChartType.SALES ? t('hint') : undefined}
        subtitle={chartType === ChartType.SALES ? t('subtitle_for_sales') : undefined}
      />
      {hiddenPlug ? (
        <>
          <Content>
            <DoughnutWrapper>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </DoughnutWrapper>

            <PieWrapper>
              <Pie data={pieData} options={pieOptions} plugins={[htmlLegendPlugin]} />
            </PieWrapper>

            <Circle>%</Circle>

            <LegendContainer id="legend-container">
              <LegendList />
            </LegendContainer>
          </Content>
        </>
      ) : (
        <ChartPlug
          icon={<PiePlugIcon />}
          text={t(plugText(chartType), { company: envUtil.appName })}
        />
      )}

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

TopSellersChart.displayName = 'TopSellersChart';
export { TopSellersChart };
