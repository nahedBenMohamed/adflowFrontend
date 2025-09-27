import { boardApiUtil, userStore } from '@/app';
import {
  CreatedAtDateSelect,
  Hint,
  MiniLoader,
  MultiselectWithCheckboxes,
  MySelect,
  UsersMultiselect,
  type DatePeriodFilterModel,
  type MultiselectModel,
  type Option,
  type SelectModel,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PipelineReportType } from '../../../../shared';
import { DashboardTypeTooltip, DataUpdateSelect } from './components';

const Root = styled.div`
  width: 1274px;

  display: flex;
  justify-content: space-between;
`;

const FiltersWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 32px;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: baseline;

  gap: 16px;
`;

const FilterItemWrapper = styled.div`
  width: 180px;
`;

interface Props {
  etId: number;
  usersModel: MultiselectModel<number>;
  datePeriodModel: DatePeriodFilterModel;
  refetching?: boolean;
  typeModel?: SelectModel;
  boardsModel?: MultiselectModel<number>;
  boardModel?: SelectModel;
  updateModeModel?: SelectModel;
  handleApply: () => void;
  handleManualUpdate?: () => void;
}

const DashboardControls = observer((props: Props) => {
  const {
    etId,
    usersModel,
    refetching = false,
    boardsModel,
    boardModel,
    typeModel,
    datePeriodModel,
    updateModeModel,
    handleApply,
    handleManualUpdate,
  } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.filter.placeholders',
  });

  const boardsOptions = boardApiUtil.useGetBoardsByEntityTypeIdOptions(etId);

  const typeOptions = useMemo<Option<PipelineReportType>[]>(
    () =>
      Object.values(PipelineReportType).map(value => ({
        value,
        label: t(`${value}`),
      })),
    [t]
  );

  return (
    <Root>
      <FiltersWrapper>
        {typeModel && (
          <FilterWrapper>
            <FilterItemWrapper>
              <MySelect
                model={typeModel}
                options={typeOptions}
                variant="outlined"
                handleChange={handleApply}
              />
            </FilterItemWrapper>

            <Hint text={<DashboardTypeTooltip type={typeModel.value} />} maxWidth={500} />
          </FilterWrapper>
        )}

        <FilterWrapper>
          <FilterItemWrapper>
            <UsersMultiselect
              variant="outlined"
              model={usersModel}
              users={userStore.activeUsers}
              placeholder={t('select_users')}
              handleChange={handleApply}
            />
          </FilterItemWrapper>

          {boardsModel && (
            <FilterItemWrapper>
              <MultiselectWithCheckboxes
                variant="outlined"
                model={boardsModel}
                options={boardsOptions}
                placeholder={t('select_sales_pipeline')}
                handleChange={handleApply}
              />
            </FilterItemWrapper>
          )}

          {boardModel && (
            <FilterItemWrapper>
              <MySelect
                model={boardModel}
                options={boardsOptions}
                variant="outlined"
                handleChange={handleApply}
              />
            </FilterItemWrapper>
          )}

          <FilterItemWrapper>
            <CreatedAtDateSelect
              withQuarters
              createdAtModel={datePeriodModel}
              handleApply={handleApply}
            />
          </FilterItemWrapper>

          <MiniLoader color="var(--primary-statuses-green-520)" visibilityHidden={!refetching} />
        </FilterWrapper>
      </FiltersWrapper>

      {updateModeModel && handleManualUpdate && (
        <DataUpdateSelect
          model={updateModeModel}
          onSelect={handleApply}
          handleManualUpdate={handleManualUpdate}
        />
      )}
    </Root>
  );
});

DashboardControls.displayName = 'DashboardControls';
export { DashboardControls };
