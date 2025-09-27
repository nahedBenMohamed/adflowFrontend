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

const TaskEndDateCell = observer((props: Props) => {
  const { cellContext } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'update_task_modal',
  });

  const endDate = cellContext.getValue();
  const {
    startDate,
    originalTask: {
      id: taskId,
      userRights: { canEdit },
    },
  } = cellContext.row.original;

  const handleChangeEndDate = useCallback(
    async (endDate: UtcDateValue): Promise<void> => {
      if (!canEdit) return;

      try {
        if (startDate.value && endDate && endDate.isBeforeOrEqual(startDate.value)) {
          startDate.setValue(endDate.startOfDay());

          await Promise.all([
            tasksStore.updateTask({
              taskId,
              dto: UpdateTaskDto.create({ startDate: endDate.startOfDay().formatISO() }),
            }),
            tasksStore.updateTask({
              taskId,
              dto: UpdateTaskDto.create({ endDate: endDate?.formatISO() ?? null }),
            }),
          ]);

          return;
        }

        await tasksStore.updateTask({
          taskId,
          dto: UpdateTaskDto.create({ endDate: endDate?.formatISO() ?? null }),
        });
      } catch (e) {
        throw new Error(`Error while changing task's ${taskId} endDate to ${endDate}: ${e}`);
      }
    },
    [canEdit, taskId, startDate]
  );

  return (
    <MyDatePickerWithTime
      withinPortal
      iconType="end"
      model={endDate}
      disabled={!canEdit}
      variant="secondary-smaller"
      dropdownTitle={t('end_date')}
      disableDatesBefore={startDate.value}
      handleChange={handleChangeEndDate}
    />
  );
});

TaskEndDateCell.displayName = 'TaskEndDateCell';
export { TaskEndDateCell };
