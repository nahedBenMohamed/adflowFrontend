import { observer } from 'mobx-react-lite';
import { useGanttContext } from '../../../../context';
import { TaskDependenceArrow } from './components';

const TasksDependencies = observer(() => {
  const { store } = useGanttContext();
  const { dependencies } = store;

  return dependencies.map((d, idx) => (
    <TaskDependenceArrow key={`${JSON.stringify(d)}-${idx}`} dependence={d} />
  ));
});

TasksDependencies.displayName = 'TasksDependencies';
export { TasksDependencies };
