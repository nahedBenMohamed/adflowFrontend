import type { ColumnResizeMode, Table } from '@tanstack/react-table';
import styled from 'styled-components';
import type { TaskRow } from '../../../../models';
import { TasksTableHeadCell } from '../TasksTableHeadCell/TasksTableHeadCell';

const THeadRow = styled.div`
  position: sticky;
  top: 0;

  height: 32px;
  width: fit-content;

  display: flex;
  align-items: center;
  gap: 16px;

  z-index: 1;

  padding: 8px 0 0 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  background-color: var(--graphite-graphite-20);

  &::before,
  &::after {
    content: '';

    position: absolute;
    top: 0;

    height: calc(100% + 1px);
    width: 8px;

    background-color: var(--graphite-graphite-20);

    z-index: 1;
  }

  &::before {
    left: -4px;
  }

  &::after {
    right: -16px;

    width: 16px;
  }
`;

interface Props {
  tasksTable: Table<TaskRow>;
  columnResizeMode: ColumnResizeMode;
  saveColumnSize: ({ columnId, size }: { columnId: string; size: number }) => void;
}

const TasksTableHead = (props: Props) => {
  const { tasksTable, columnResizeMode, saveColumnSize } = props;

  return (
    <>
      {tasksTable.getHeaderGroups().map(hg => (
        <THeadRow key={hg.id}>
          {hg.headers.map(h => (
            <TasksTableHeadCell
              key={h.id}
              header={h}
              columnResizeMode={columnResizeMode}
              sizingDeltaOffset={tasksTable.getState().columnSizingInfo.deltaOffset}
              saveColumnSize={saveColumnSize}
            />
          ))}
        </THeadRow>
      ))}
    </>
  );
};

export { TasksTableHead };
