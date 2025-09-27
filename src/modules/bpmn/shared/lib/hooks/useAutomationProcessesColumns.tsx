import { ActionsHeaderCell, UserView } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AutomationProcessStatusCell,
  AutomatonProcessNameCell,
  DeleteAutomationProcessCell,
} from '../components';
import {
  AutomationProcessesColumnsIds,
  AutomationProcessesColumnsSizes,
  type AutomationProcessRow,
} from '../models';

export const useAutomationProcessesColumns = ({
  getSelectAutomationProcessHandler,
}: {
  getSelectAutomationProcessHandler: (automationId: number) => () => void;
}) => {
  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.hooks.use_bpmn_automations_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<AutomationProcessRow>();

    return [
      columnHelper.accessor('name', {
        id: AutomationProcessesColumnsIds.NAME,
        header: t('name'),
        cell: info => {
          const { id, name } = info.row.original;

          return (
            <AutomatonProcessNameCell
              model={name}
              processId={id}
              handleOpenEditor={getSelectAutomationProcessHandler(id)}
            />
          );
        },
      }),

      columnHelper.accessor('createdBy', {
        id: AutomationProcessesColumnsIds.CREATED_BY,
        header: t('created_by'),
        size: AutomationProcessesColumnsSizes[AutomationProcessesColumnsIds.CREATED_BY],
        minSize: AutomationProcessesColumnsSizes[AutomationProcessesColumnsIds.CREATED_BY],
        maxSize: AutomationProcessesColumnsSizes[AutomationProcessesColumnsIds.CREATED_BY],
        cell: info => <UserView size="small" user={info.getValue()} />,
      }),

      columnHelper.accessor('isActive', {
        id: AutomationProcessesColumnsIds.ACTIVE,
        header: t('status'),
        size: AutomationProcessesColumnsSizes[AutomationProcessesColumnsIds.ACTIVE],
        minSize: AutomationProcessesColumnsSizes[AutomationProcessesColumnsIds.ACTIVE],
        maxSize: AutomationProcessesColumnsSizes[AutomationProcessesColumnsIds.ACTIVE],
        cell: info => {
          const { id, isActive, name } = info.row.original;

          return <AutomationProcessStatusCell name={name} processId={id} model={isActive} />;
        },
      }),

      columnHelper.display({
        id: AutomationProcessesColumnsIds.DELETE,
        header: ActionsHeaderCell,
        size: AutomationProcessesColumnsSizes[AutomationProcessesColumnsIds.DELETE],
        minSize: AutomationProcessesColumnsSizes[AutomationProcessesColumnsIds.DELETE],
        maxSize: AutomationProcessesColumnsSizes[AutomationProcessesColumnsIds.DELETE],
        cell: info => {
          const { id, name } = info.row.original;

          return <DeleteAutomationProcessCell processId={id} name={name} />;
        },
      }),
    ];
  }, [getSelectAutomationProcessHandler, t]);
};
