import { BaseTableBodyCell, BaseTableBodyRowFilled } from '@/shared';
import { flexRender, type Table } from '@tanstack/react-table';
import styled from 'styled-components';
import type { TaskRow } from '../../../../models';

const TasksTableBodyRow = styled(BaseTableBodyRowFilled)`
  &:hover {
    .workspace__DeleteButton--Root {
      opacity: 1;
      scale: 1;
    }
  }
`;

interface Props {
  tasksTable: Table<TaskRow>;
}

const TasksTableBody = (props: Props) => {
  const { tasksTable } = props;

  return tasksTable.getRowModel().rows.map(r => (
    <TasksTableBodyRow key={r.id}>
      {r.getVisibleCells().map(c => (
        <BaseTableBodyCell key={c.id} style={{ width: c.column.getSize() }}>
          {flexRender(c.column.columnDef.cell, c.getContext())}
        </BaseTableBodyCell>
      ))}
    </TasksTableBodyRow>
  ));
};

export { TasksTableBody };
