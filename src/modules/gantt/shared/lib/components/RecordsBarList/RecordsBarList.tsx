import { observer } from 'mobx-react-lite';
import { useGanttContext } from '../../../../context';
import { RecordBar, RecordGroupBar } from './components';

const RecordsBarList = observer(() => {
  const { store } = useGanttContext();
  const barList = store.barList;

  const { count, start } = store.getVisibleRows;

  return barList.slice(start, start + count).map(b => {
    if (b.group) return <RecordGroupBar key={b.key} bar={b} />;

    return b.invalidDateRange ? null : <RecordBar key={b.key} bar={b} />;
  });
});

RecordsBarList.displayName = 'RecordsBarList';
export { RecordsBarList };
