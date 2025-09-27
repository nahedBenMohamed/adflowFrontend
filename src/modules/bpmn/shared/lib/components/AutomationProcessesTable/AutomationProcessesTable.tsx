import { BaseTable } from '@/shared';
import { getCoreRowModel, useReactTable, type Cell, type Header } from '@tanstack/react-table';
import { useCallback, type CSSProperties } from 'react';
import styled from 'styled-components';
import { useAutomationProcessesColumns, useAutomationProcessesData } from '../../hooks';
import {
  AutomationProcessesColumnsIds,
  type AutomationProcess,
  type AutomationProcessRow,
} from '../../models';
import { NoAutomationProcessesBlock } from './components';

const Root = styled.div`
  width: 100%;
  height: 100%;

  padding: 16px;
`;

interface Props {
  entityTypeId: number;
  automationProcesses: AutomationProcess[];
  handleSelectAutomationProcess: (automationId: number) => void;
}

const AutomationProcessesTable = (props: Props) => {
  const { entityTypeId, automationProcesses, handleSelectAutomationProcess } = props;

  const getSelectAutomationProcessHandler = useCallback(
    (automationId: number) => () => handleSelectAutomationProcess(automationId),
    [handleSelectAutomationProcess]
  );

  const data = useAutomationProcessesData(automationProcesses);
  const columns = useAutomationProcessesColumns({
    getSelectAutomationProcessHandler,
  });

  const table = useReactTable<AutomationProcessRow>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Root>
      {data.length > 0 ? (
        <BaseTable
          table={table}
          tableLoading={false}
          headProps={{
            headRowProps: {
              $backgroundColor: 'var(--graphite-graphite-20)',
            },
            getCellStyleFn: (header: Header<AutomationProcessRow, unknown>): CSSProperties => {
              if (header.column.id === AutomationProcessesColumnsIds.NAME) return { flex: 1 };

              return { width: header.column.getSize() };
            },
          }}
          bodyProps={{
            bodyRowProps: {
              $filled: true,
            },
            getCellStyleFn: (cell: Cell<AutomationProcessRow, unknown>): CSSProperties => {
              if (cell.column.id === AutomationProcessesColumnsIds.NAME) return { flex: 1 };

              return { width: cell.column.getSize() };
            },
          }}
        />
      ) : (
        <NoAutomationProcessesBlock entityTypeId={entityTypeId} />
      )}
    </Root>
  );
};

export { AutomationProcessesTable };
