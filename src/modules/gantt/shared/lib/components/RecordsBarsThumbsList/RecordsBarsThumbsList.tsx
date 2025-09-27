import { observer } from 'mobx-react-lite';
import { useGanttContext } from '../../../../context';
import { RecordBarThumb } from './components';

const RecordsBarsThumbsList = observer(() => {
  const { store } = useGanttContext();

  const barList = store.barList;

  const { count, start } = store.getVisibleRows;

  return barList
    .slice(start, start + count)
    .map(bar =>
      store.getRecordBarThumbVisible(bar) ? <RecordBarThumb bar={bar} key={bar.key} /> : null
    );
});

RecordsBarsThumbsList.displayName = 'RecordsBarsThumbsList';
export { RecordsBarsThumbsList };
