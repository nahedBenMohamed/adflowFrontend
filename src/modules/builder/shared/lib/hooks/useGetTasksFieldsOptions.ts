import { TaskFieldCode } from '@/modules/tasks';
import type { Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useGetTasksFieldsOptions = (): Option<TaskFieldCode>[] => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.et_section_builder_page.tasks_fields_options',
  });

  return useMemo(
    () => [
      { label: t('planned_time'), value: TaskFieldCode.PLANNED_TIME },
      { label: t('board_name'), value: TaskFieldCode.BOARD_NAME },
      { label: t('start_date'), value: TaskFieldCode.START_DATE },
      { label: t('end_date'), value: TaskFieldCode.END_DATE },
      { label: t('description'), value: TaskFieldCode.DESCRIPTION },
      { label: t('subtasks'), value: TaskFieldCode.SUBTASKS },
    ],
    [t]
  );
};
