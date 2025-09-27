import { WholePageLoaderWithLogo } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Fragment, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetPipelineReport } from '../../../../api';
import {
  AnalyticsValueType,
  BlockHeader,
  CountupComponent,
  PipelineReportType,
  generateSalesAnalytics,
  type SalesPipelineFilter,
} from '../../../../shared';
import { type SalesPipelineFilterForm } from '../../Dashboard';
import { Unit } from '../AnalyticsBlock/components/Unit/Unit';
import { DashboardControls } from '../DashboardControls/DashboardControls';
import { StageRow } from './components';

const Root = styled.article`
  width: 100%;

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

const IndicatorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 24px 16px;
`;

const AnalyticsWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  padding: 16px 0 0;
  border-top: 1px solid var(--graphite-graphite-80);
`;

const Delimiter = styled.hr`
  width: 1px;
  height: 64px;

  background-color: var(--graphite-graphite-80);
`;

interface Props {
  etId: number;
  filter: SalesPipelineFilter;
  filterForm: SalesPipelineFilterForm;
  handleApply: () => void;
}

const getUnitBody = ({
  valueType,
  value,
}: {
  valueType: AnalyticsValueType;
  value: number;
}): ReactNode => {
  switch (valueType) {
    case 'count':
      return <CountupComponent number={value} />;

    case 'amount':
      return <CountupComponent number={value} type={AnalyticsValueType.AMOUNT} />;

    case 'percent':
      return <CountupComponent number={value} type={AnalyticsValueType.PERCENT} />;

    case 'days':
      return <CountupComponent number={value} type={AnalyticsValueType.DAYS} />;

    default:
      return null;
  }
};

const SalesPipelineIndicators = observer((props: Props) => {
  const { etId, filter, filterForm, handleApply } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.sales_pipeline_indicators',
  });

  const { data: pipelineReport, isLoading, isRefetching } = useGetPipelineReport({ etId, filter });
  const salesAnalytics = generateSalesAnalytics(pipelineReport);

  return (
    <Root>
      <BlockHeader title={t('title')} withMinHeight={false} />

      <DashboardControls
        etId={etId}
        typeModel={filterForm.typeModel}
        usersModel={filterForm.usersModel}
        boardModel={filterForm.boardModel}
        datePeriodModel={filterForm.datePeriodModel}
        refetching={isRefetching}
        handleApply={handleApply}
      />

      {isLoading ? (
        <WholePageLoaderWithLogo ensureHeaderWithOffset />
      ) : (
        <>
          <IndicatorsWrapper>
            {pipelineReport &&
              pipelineReport.rows.map((p, idx) => (
                <StageRow
                  key={idx}
                  value={p.value}
                  count={p.count}
                  percent={p.percent}
                  color={p.stageColor}
                  daysCountInSeconds={p.daysCount}
                  stageName={p.stageName}
                />
              ))}
          </IndicatorsWrapper>

          {![PipelineReportType.OPEN, PipelineReportType.OPEN_ACTIVE].includes(filter.type) && (
            <AnalyticsWrapper>
              {salesAnalytics.map((sa, idx) => (
                <Fragment key={idx}>
                  {typeof sa.value === 'number' && (
                    <Unit title={t(sa.title)} color={sa.color} icon={sa.icon} withoutShadow>
                      {getUnitBody({ valueType: sa.valueType, value: sa.value })}
                    </Unit>
                  )}

                  {idx < salesAnalytics.length - 1 && <Delimiter />}
                </Fragment>
              ))}
            </AnalyticsWrapper>
          )}
        </>
      )}
    </Root>
  );
});

SalesPipelineIndicators.displayName = 'SalesPipelineIndicators';
export { SalesPipelineIndicators };
