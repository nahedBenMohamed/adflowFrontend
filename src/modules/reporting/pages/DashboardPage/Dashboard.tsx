import { SettingsStore } from '@/app';
import { EntitiesPageUtil, getCreatedAtFilter } from '@/modules/section';
import {
  DatePeriodFilterModel,
  DatePeriodFilterType,
  EntityCategory,
  MultiselectModel,
  SelectModel,
  UtcDate,
  debounce,
  type EntityType,
  type Optional,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  useGetActivitiesSummaryReport,
  useGetEntitySummaryReport,
  useGetRating,
  useGetSalesPlanReport,
  useGetTasksSummaryReport,
  useGetTopSellers,
  type ReportFilter,
} from '../../api';
import {
  AutoUpdateMode,
  AutoUpdateTime,
  ChartType,
  DashboardFilter,
  PipelineReportType,
  SalesGoalModel,
  SalesPipelineFilter,
  SalesPlanPeriodFilterType,
  type DashboardFilterSettings,
  type SalesPipelineFilterSettings,
} from '../../shared';
import {
  AnalyticsBlock,
  DashboardControls,
  GoalChart,
  LeadsStatusChart,
  RatingChart,
  SalesPipelineIndicators,
  TopSellersChart,
  TrafficLightReport,
} from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-bottom: 16px;
`;

const ChartsContainer = styled.div`
  width: 1306px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  padding: 0 16px;
`;

const ChartsWithControlsBlock = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DashboardControlsWrapper = styled.div<{ $fixed: boolean }>`
  position: sticky;
  top: calc(var(--header-with-subheader-height));
  left: 0;

  width: 100%;
  height: var(--header-height);

  // to avoid overlapping of the subheader content
  z-index: calc(var(--subheader-z-index) - 1);

  padding: 16px 0 8px 16px;
  background-color: var(--graphite-graphite-20);
`;

const FullWidthBlock = styled.div`
  grid-column: 1 / 4;
`;

const RatingWrapper = styled.div<{ $fullWidth?: boolean }>`
  grid-column: ${p => (p.$fullWidth ? '1 / 4' : '1 / 3')};
`;

const SalesPipelineIndicatorsWrapper = styled.div`
  width: 1306px;

  padding: 0 16px;
`;

interface Props {
  et: EntityType;
  firstBoardId: Optional<number>;
}

interface FilterFormBase {
  usersModel: MultiselectModel<number>;
  datePeriodModel: DatePeriodFilterModel;
}

interface FilterForm extends FilterFormBase {
  boardsModel: MultiselectModel<number>;
  autoUpdateModeModel: SelectModel;
}

export interface SalesPipelineFilterForm extends FilterFormBase {
  boardModel: SelectModel;
  typeModel: SelectModel;
}

const DASHBOARD_FILTER_SETTINGS_KEY = 'DashboardFilterSettings';
const SALES_PIPELINE_FILTER_SETTINGS_KEY = 'SalesPipelineFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{ filters: DashboardFilterSettings[] }>(
  DASHBOARD_FILTER_SETTINGS_KEY
);

const { settings: salesPipelineSettings } = SettingsStore.getSettingsStore<{
  filters: SalesPipelineFilterSettings[];
}>(SALES_PIPELINE_FILTER_SETTINGS_KEY);

if (!settings.filters) settings.filters = [];

const Dashboard = observer((props: Props) => {
  const { et, firstBoardId } = props;
  const { id: etId } = et;

  const savedFilterSettings = settings.filters
    ? settings.filters.find(s => s.etId === etId)
    : undefined;

  const savedSalesPipelineFilterSettings = salesPipelineSettings.filters
    ? salesPipelineSettings.filters.find(s => s.etId === etId)
    : undefined;

  const filterForm = useLocalObservable<FilterForm>(() => ({
    usersModel: MultiselectModel.create(savedFilterSettings?.filter.users ?? []),
    boardsModel: MultiselectModel.create(savedFilterSettings?.filter.boards ?? []),
    datePeriodModel: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter.datePeriodModel?.type ?? DatePeriodFilterType.CURRENT_MONTH,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter.datePeriodModel?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter.datePeriodModel?.to),
    }),
    autoUpdateModeModel: SelectModel.create(
      savedFilterSettings?.filter.autoUpdateMode ?? AutoUpdateMode.NEVER
    ),
  }));

  const salesPipelineFilterForm = useLocalObservable<SalesPipelineFilterForm>(() => ({
    typeModel: SelectModel.create(
      savedSalesPipelineFilterSettings?.filter.type ?? PipelineReportType.ALL
    ),
    boardModel: SelectModel.create(
      savedSalesPipelineFilterSettings?.filter.boardId ?? firstBoardId
    ),
    usersModel: MultiselectModel.create(savedSalesPipelineFilterSettings?.filter.userIds ?? []),
    datePeriodModel: new DatePeriodFilterModel({
      type:
        savedSalesPipelineFilterSettings?.filter.period?.type ?? DatePeriodFilterType.CURRENT_MONTH,
      from: UtcDate.parseISONullable(savedSalesPipelineFilterSettings?.filter.period?.from),
      to: UtcDate.parseISONullable(savedSalesPipelineFilterSettings?.filter.period?.to),
    }),
  }));

  const [filter, setFilter] = useState<DashboardFilter>(() => ({
    users: filterForm.usersModel.values.length ? filterForm.usersModel.values : null,
    boards: filterForm.boardsModel.values,
    datePeriodModel: getCreatedAtFilter(filterForm.datePeriodModel),
  }));

  const [salesPipelineFilter, setSalesPipelineFilter] = useState<SalesPipelineFilter>(() => ({
    type: salesPipelineFilterForm.typeModel.value,
    boardId: salesPipelineFilterForm.boardModel.value,
    userIds: salesPipelineFilterForm.usersModel.values.length ? filterForm.usersModel.values : null,
    period: getCreatedAtFilter(salesPipelineFilterForm.datePeriodModel),
  }));

  const handleApply = useCallback(() => {
    const createdAtDatePeriodFilter = getCreatedAtFilter(filterForm.datePeriodModel);

    const filter = new DashboardFilter({
      users: filterForm.usersModel.valuesOrNull,
      datePeriodModel: createdAtDatePeriodFilter,
      boards: filterForm.boardsModel.valuesOrNull,
      autoUpdateMode: filterForm.autoUpdateModeModel.value,
    });

    const savedFilters = settings.filters ?? [];

    settings.filters = [
      ...savedFilters.filter(f => f.etId !== etId),
      {
        etId,
        filter,
      },
    ];

    setFilter(filter);
  }, [
    etId,
    filterForm.usersModel,
    filterForm.boardsModel,
    filterForm.datePeriodModel,
    filterForm.autoUpdateModeModel,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedApply = useCallback(debounce(handleApply, 500), []);

  const handleSalesPipelineFilterApply = useCallback(() => {
    const createdAtDatePeriodFilter = getCreatedAtFilter(salesPipelineFilterForm.datePeriodModel);

    const filter = new SalesPipelineFilter({
      type: salesPipelineFilterForm.typeModel.value,
      boardId: salesPipelineFilterForm.boardModel.value,
      userIds: salesPipelineFilterForm.usersModel.values,
      period: createdAtDatePeriodFilter,
    });

    const savedFilters = salesPipelineSettings.filters ?? [];

    salesPipelineSettings.filters = [
      ...savedFilters.filter(f => f.etId !== etId),
      {
        etId,
        filter,
      },
    ];

    setSalesPipelineFilter(filter);
  }, [
    etId,
    salesPipelineFilterForm.boardModel,
    salesPipelineFilterForm.datePeriodModel,
    salesPipelineFilterForm.typeModel,
    salesPipelineFilterForm.usersModel,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSalesPipelineFilterApply = useCallback(
    debounce(handleSalesPipelineFilterApply, 500),
    []
  );

  const reportFilter = useMemo<ReportFilter>(
    () => ({
      userIds: filter.users,
      boardIds: filter.boards ?? [],
      period: {
        type: filter.datePeriodModel?.type,
        from: filter.datePeriodModel?.from,
        to: filter.datePeriodModel?.to,
      },
    }),
    [filter]
  );

  const autoUpdateTime = useMemo<Optional<number>>(
    () => AutoUpdateTime[filterForm.autoUpdateModeModel.value as AutoUpdateMode],
    [filterForm.autoUpdateModeModel.value]
  );

  const {
    data: rating,
    hasNextPage,
    fetchNextPage,
    refetch: refetchTopSellers,
  } = useGetRating({ etId, filter: reportFilter, refetchInterval: autoUpdateTime });

  const { data: salesPlanReport, refetch: refetchSalesPlanReport } = useGetSalesPlanReport({
    etId,
    filter: {
      ...reportFilter,
      period: {
        type:
          filter.datePeriodModel?.type &&
          SalesPlanPeriodFilterType.some(
            s => filter.datePeriodModel && s === filter.datePeriodModel.type
          )
            ? filter.datePeriodModel?.type
            : DatePeriodFilterType.CURRENT_MONTH,
      },
    },
    refetchInterval: autoUpdateTime,
  });

  const {
    data: entitiesReport,
    isLoading: isEntitiesReportLoading,
    refetch: refetchEntitySummaryReport,
  } = useGetEntitySummaryReport({
    etId,
    filter: reportFilter,
    refetchInterval: autoUpdateTime,
  });

  const {
    data: tasksReport,
    isLoading: isTaskReportLoading,
    refetch: refetchTasksSummaryReport,
  } = useGetTasksSummaryReport({
    etId,
    filter: reportFilter,
    refetchInterval: autoUpdateTime,
  });

  const {
    data: activitiesReport,
    isLoading: isActivitiesReportLoading,
    refetch: refetchActivitiesSummaryReport,
  } = useGetActivitiesSummaryReport({
    etId,
    filter: reportFilter,
    refetchInterval: autoUpdateTime,
  });

  const { data: topSellers } = useGetTopSellers({
    etId,
    filter: reportFilter,
    refetchInterval: autoUpdateTime,
  });

  const speedometerModel = useMemo(
    () =>
      SalesGoalModel.create(
        {
          current: salesPlanReport?.amount.current ?? 0,
          goal: salesPlanReport?.amount.plannedTotal ?? 0,
        },
        {
          current: salesPlanReport?.quantity.current ?? 0,
          goal: salesPlanReport?.quantity.plannedTotal ?? 0,
        }
      ),
    [salesPlanReport]
  );

  const refetchData = useCallback(() => {
    refetchTopSellers();
    refetchSalesPlanReport();
    refetchEntitySummaryReport();
    refetchTasksSummaryReport();
    refetchActivitiesSummaryReport();
    // add func to refetch sales pipeline data
  }, [
    refetchTopSellers,
    refetchSalesPlanReport,
    refetchEntitySummaryReport,
    refetchTasksSummaryReport,
    refetchActivitiesSummaryReport,
  ]);

  const showTrafficLight = ![
    EntityCategory.HR,
    EntityCategory.SUPPLIER,
    EntityCategory.CONTRACTOR,
  ].includes(et.entityCategory);

  const chartType = (): ChartType => {
    switch (true) {
      case et.isContractorCategory():
      case et.isSupplierCategory():
        return ChartType.ORDERS;

      case et.isHRCategory():
        return ChartType.CANDIDATES;

      default:
        return ChartType.SALES;
    }
  };

  const showMockSalesPipelineIndicatorsData =
    !isTaskReportLoading && !isEntitiesReportLoading && !isActivitiesReportLoading;

  return (
    <Root>
      <ChartsWithControlsBlock>
        <DashboardControlsWrapper $fixed={true}>
          <DashboardControls
            etId={etId}
            usersModel={filterForm.usersModel}
            boardsModel={filterForm.boardsModel}
            datePeriodModel={filterForm.datePeriodModel}
            updateModeModel={filterForm.autoUpdateModeModel}
            handleApply={debouncedApply}
            handleManualUpdate={refetchData}
          />
        </DashboardControlsWrapper>

        <ChartsContainer>
          <GoalChart etId={etId} model={speedometerModel} chartType={chartType()} />

          {showTrafficLight ? (
            <TrafficLightReport salesPlanReport={salesPlanReport} />
          ) : (
            <TopSellersChart topSellers={topSellers} chartType={chartType()} />
          )}

          {showTrafficLight ? (
            <TopSellersChart topSellers={topSellers} chartType={chartType()} />
          ) : (
            entitiesReport && <LeadsStatusChart model={entitiesReport} chartType={chartType()} />
          )}

          <FullWidthBlock>
            <AnalyticsBlock
              et={et}
              tasks={tasksReport}
              entities={entitiesReport}
              activities={activitiesReport}
              chartType={chartType()}
            />
          </FullWidthBlock>
        </ChartsContainer>
      </ChartsWithControlsBlock>

      <ChartsContainer>
        <RatingWrapper $fullWidth={!showTrafficLight}>
          {rating && (
            <RatingChart
              hasNextPage={hasNextPage}
              chartType={chartType()}
              topSellersData={rating.pages}
              fetchNextPage={fetchNextPage}
            />
          )}
        </RatingWrapper>

        {showTrafficLight && entitiesReport && (
          <LeadsStatusChart model={entitiesReport} chartType={chartType()} />
        )}
      </ChartsContainer>

      {!EntitiesPageUtil.companyAndContactEntityTypeCategories().includes(et.entityCategory) &&
        showMockSalesPipelineIndicatorsData && (
          <SalesPipelineIndicatorsWrapper>
            <SalesPipelineIndicators
              etId={etId}
              filter={salesPipelineFilter}
              filterForm={salesPipelineFilterForm}
              handleApply={debouncedSalesPipelineFilterApply}
            />
          </SalesPipelineIndicatorsWrapper>
        )}
    </Root>
  );
});

Dashboard.displayName = 'Dashboard';
export { Dashboard };
