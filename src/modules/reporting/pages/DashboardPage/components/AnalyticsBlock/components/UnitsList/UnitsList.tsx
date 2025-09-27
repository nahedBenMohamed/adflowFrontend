import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  ChartType,
  EntitiesReport,
  type LeadsUnit,
  TasksReport,
  type TasksUnit,
  generateActivitiesUnits,
  generateEntitiesUnits,
  generateTasksUnits,
} from '../../../../../../shared';
import { Unit } from '../Unit/Unit';
import { UnitBody } from '../UnitBody/UnitBody';

const Root = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
`;

type UnitType = 'entities' | 'tasks' | 'activities';

interface Props {
  unitType: UnitType;
  unitsList?: EntitiesReport | TasksReport;
  chartType?: ChartType;
}

const UnitsList = (props: Props) => {
  const { unitsList, unitType, chartType } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.analytics',
  });

  const entities = useMemo<LeadsUnit[]>(
    () => generateEntitiesUnits(chartType ?? ChartType.SALES),
    [chartType]
  );
  const tasks = useMemo<TasksUnit[]>(
    () => generateTasksUnits(chartType ?? ChartType.SALES),
    [chartType]
  );
  const activities = useMemo<TasksUnit[]>(
    () => generateActivitiesUnits(chartType ?? ChartType.SALES),
    [chartType]
  );

  return (
    <Root>
      {unitType === 'entities' &&
        unitsList instanceof EntitiesReport &&
        entities.map((u, idx) => (
          <Unit {...u} key={idx} title={t(u.title())}>
            <UnitBody
              count={unitsList[u.type]?.quantity}
              amount={
                unitsList && chartType !== ChartType.CANDIDATES
                  ? unitsList[u.type].amount
                  : undefined
              }
            />
          </Unit>
        ))}

      {unitType === 'tasks' &&
        unitsList instanceof TasksReport &&
        tasks.map((u, idx) => (
          <Unit {...u} key={idx} title={t(u.title())}>
            <UnitBody count={unitsList[u.type]} />
          </Unit>
        ))}

      {unitType === 'activities' &&
        unitsList instanceof TasksReport &&
        activities.map((u, idx) => (
          <Unit {...u} key={idx} title={t(u.title())}>
            <UnitBody count={unitsList[u.type]} />
          </Unit>
        ))}
    </Root>
  );
};

export { UnitsList };
