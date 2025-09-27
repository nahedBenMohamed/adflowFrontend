import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BlockHeader, ChartType, TopSellersPlugIcon, type SellersRating } from '../../../../shared';
import { RatingList } from './components';

const Root = styled.article`
  width: 100%;
  height: 450px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
  background-color: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
`;

const Content = styled.div`
  height: 100%;

  overflow: hidden;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;

  svg {
    flex-shrink: 0;
  }
`;

interface Props {
  topSellersData: SellersRating[];
  chartType: ChartType;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
}

const RatingChart = (props: Props) => {
  const { topSellersData, chartType, hasNextPage, fetchNextPage } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.rating',
  });

  const isUsersInTop = topSellersData[0] && topSellersData[0].users.length;

  return (
    <Root>
      <BlockHeader
        title={t('title')}
        withMinHeight={false}
        hint={chartType === ChartType.SALES ? t('hint') : undefined}
      />

      {isUsersInTop ? (
        <Content>
          <RatingList
            hasNextPage={hasNextPage}
            topSellersData={topSellersData}
            fetchNextPage={fetchNextPage}
          />
        </Content>
      ) : (
        <IconWrapper>
          <TopSellersPlugIcon />
        </IconWrapper>
      )}
    </Root>
  );
};

export { RatingChart };
