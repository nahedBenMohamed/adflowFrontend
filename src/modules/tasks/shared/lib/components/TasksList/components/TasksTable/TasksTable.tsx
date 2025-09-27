import { useGrabScroll } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { ColumnResizeMode, Table } from '@tanstack/react-table';
import { useEffect, type Ref } from 'react';
import styled, { css } from 'styled-components';
import type { TaskRow } from '../../../../models';
import { TasksTableBody } from '../TasksTableBody/TasksTableBody';
import { TasksTableHead } from '../TasksTableHead/TasksTableHead';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-bottom: 16px;
`;

const TableRoot = styled.div`
  width: fit-content;
`;

const TableBody = styled.div<{ $tracked: boolean }>`
  width: 100%;

  ${p =>
    p.$tracked &&
    css`
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    `}
`;

interface Props {
  ref?: Ref<HTMLDivElement>;
  isLoaded: boolean;
  tasksTable: Table<TaskRow>;
  columnResizeMode: ColumnResizeMode;
  saveColumnSize: ({ columnId, size }: { columnId: string; size: number }) => void;
}

export const TASKS_TABLE_BODY_ID = 'workspace__TasksTableBody--Root';

const TasksTable = (props: Props) => {
  const { ref, isLoaded, tasksTable, columnResizeMode, saveColumnSize } = props;

  const [isAllowedGrabScrolling, { open: allowGrabScrolling, close: disallowGrabScrolling }] =
    useDisclosure(true);

  const { containerRef: rootRef, tracked, handlers } = useGrabScroll(isAllowedGrabScrolling);

  useEffect(() => {
    const tableBody = document.getElementById(TASKS_TABLE_BODY_ID);

    if (!tableBody) return;

    // to prevent text select and grab scroll conflicts
    tableBody.addEventListener('focusin', disallowGrabScrolling);
    tableBody.addEventListener('focusout', allowGrabScrolling);

    return () => {
      tableBody.removeEventListener('focusin', disallowGrabScrolling);
      tableBody.removeEventListener('focusout', allowGrabScrolling);
    };
  }, [isLoaded, allowGrabScrolling, disallowGrabScrolling]);

  return (
    <Root ref={rootRef}>
      <TableRoot ref={ref}>
        <TasksTableHead
          tasksTable={tasksTable}
          columnResizeMode={columnResizeMode}
          saveColumnSize={saveColumnSize}
        />

        <TableBody id={TASKS_TABLE_BODY_ID} {...handlers} $tracked={tracked}>
          <TasksTableBody tasksTable={tasksTable} />
        </TableBody>
      </TableRoot>
    </Root>
  );
};

export { TasksTable };
