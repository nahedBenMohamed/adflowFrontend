import { MyDatePickerWithTime, type SelectModel, type UtcDateValue } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateTaskDto } from '../../../../../../../api';
import { tasksStore } from '../../../../../../../store';
import type { TaskRow } from '../../../../../models';

interface Props {
  cellContext: CellContext<TaskRow, SelectModel>;
}

const TaskStartDateCell = observer((props: Props) => {
  const { cellContext } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'update_task_modal',
  });

  const startDate = cellContext.getValue();
  const {
    endDate,
    originalTask: {
      id: taskId,
      userRights: { canEdit },
    },
  } = cellContext.row.original;

  const handleChangeStartDate = useCallback(
    async (startDate: UtcDateValue): Promise<void> => {
      if (!canEdit) return;

      try {
        if (endDate.value && startDate && startDate.isAfterOrEqual(endDate.value)) {
          endDate.setValue(startDate.endOfDay());

          await Promise.all([
            tasksStore.updateTask({
              taskId,
              dto: UpdateTaskDto.create({ endDate: startDate.endOfDay().formatISO() }),
            }),
            tasksStore.updateTask({
              taskId,
              dto: UpdateTaskDto.create({ startDate: startDate?.formatISO() ?? null }),
            }),
          ]);

          return;
        }

        await tasksStore.updateTask({
          taskId,
          dto: UpdateTaskDto.create({ startDate: startDate?.formatISO() ?? null }),
        });
      } catch (e) {
        throw new Error(`Error while changing task's ${taskId} startDate to ${startDate}: ${e}`);
      }
    },
    [canEdit, taskId, endDate]
  );

  return (
    <MyDatePickerWithTime
      withinPortal
      model={startDate}
      disabled={!canEdit}
      variant="secondary-smaller"
      dropdownTitle={t('start_date')}
      disableDatesAfter={endDate.value}
      handleChange={handleChangeStartDate}
    />
  );
});

TaskStartDateCell.displayName = 'TaskStartDateCell';
export { TaskStartDateCell };
