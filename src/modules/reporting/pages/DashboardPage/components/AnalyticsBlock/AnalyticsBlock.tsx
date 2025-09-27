import { FeatureCode, type EntityType } from '@/shared';
import { memo } from 'react';
import styled from 'styled-components';
import type { ChartType, EntitiesReport, TasksReport } from '../../../../shared';
import { UnitsList } from './components';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const UnitsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

interface Props {
  et: EntityType;
  entities?: EntitiesReport;
  tasks?: TasksReport;
  activities?: TasksReport;
  chartType?: ChartType;
}

const AnalyticsBlock = memo((props: Props) => {
  const { et, entities, tasks, activities, chartType } = props;

  return (
    <Root>
      <UnitsWrapper>
        <UnitsList unitsList={entities} unitType="entities" chartType={chartType} />
        {et.hasFeature(FeatureCode.TASK) && (
          <UnitsList unitsList={tasks} unitType="tasks" chartType={chartType} />
        )}

        {et.hasFeature(FeatureCode.ACTIVITY) && (
          <UnitsList unitsList={activities} unitType="activities" chartType={chartType} />
        )}
      </UnitsWrapper>
    </Root>
  );
});

AnalyticsBlock.displayName = 'AnalyticsBlock';
export { AnalyticsBlock };
