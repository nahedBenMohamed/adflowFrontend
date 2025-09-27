import { authStore } from '@/modules/auth';
import { observer } from 'mobx-react-lite';
import { Block, Speedometer, type ChartType, type SalesGoalModel } from '../../../../shared';
import { GoalSettingsLink } from './components';

interface Props {
  etId: number;
  model: SalesGoalModel;
  chartType: ChartType;
}

const GoalChart = observer((props: Props) => {
  const { etId, model, chartType } = props;

  const isAdmin = authStore.isAdmin();

  return (
    <Block>
      {isAdmin && <GoalSettingsLink etId={etId} chartType={chartType} />}

      <Speedometer model={model} withHint chartType={chartType} />
    </Block>
  );
});

GoalChart.displayName = 'GoalChart';
export { GoalChart };
