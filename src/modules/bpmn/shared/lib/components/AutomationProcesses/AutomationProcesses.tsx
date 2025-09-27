import type { Nullable } from '@/shared';
import { memo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import '../../../../styles/bpmn-js.css';
import { type AutomationProcess, SELECTED_AUTOMATION_PROCESS_ID_QUERY_PARAM } from '../../models';
import { AutomationProcessesModeler } from '../AutomationProcessesModeler/AutomationProcessesModeler';
import { AutomationProcessesTable } from '../AutomationProcessesTable/AutomationProcessesTable';

const Root = styled.div`
  height: calc(100dvh - var(--header-with-subheader-height));

  display: flex;
`;

interface Props {
  backLink: string;
  entityTypeId: number;
  automationProcesses: AutomationProcess[];
  selectedAutomationProcessId: Nullable<number>;
}

const AutomationProcesses = memo((props: Props) => {
  const { backLink, entityTypeId, automationProcesses, selectedAutomationProcessId } = props;

  const [, setSearchParams] = useSearchParams();

  const handleSelectAutomationProcess = useCallback(
    (automationId: number) => {
      setSearchParams(prev => {
        prev.set(SELECTED_AUTOMATION_PROCESS_ID_QUERY_PARAM, String(automationId));

        return prev;
      });
    },
    [setSearchParams]
  );

  return (
    <Root>
      {selectedAutomationProcessId ? (
        <AutomationProcessesModeler
          backLink={backLink}
          entityTypeId={entityTypeId}
          selectedAutomationProcessId={selectedAutomationProcessId}
        />
      ) : (
        <AutomationProcessesTable
          entityTypeId={entityTypeId}
          automationProcesses={automationProcesses}
          handleSelectAutomationProcess={handleSelectAutomationProcess}
        />
      )}
    </Root>
  );
});

AutomationProcesses.displayName = 'AutomationProcesses';
export { AutomationProcesses };
