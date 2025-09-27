import { stageApiUtil } from '@/app';
import type { Nullable, Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { activityTypeStore } from '../../../store';
import { getTasksSortingOptions } from '../helpers';
import type { DeadlineType, TaskSorting } from '../models';
import { useGetGroupOptions } from './useGetGroupOptions';

interface AllTasksFilterItemsOptions {
  sortingOptions: Option<TaskSorting>[];
  activityTypesOptions: Option<number>[];
  stagesOptions: Option<number, { bgColor: string }>[];
  groupsOptions: Option<DeadlineType>[];
}

export const useGetAllTasksFilterOptions = (
  boardId: Nullable<number>
): AllTasksFilterItemsOptions => {
  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.tasks_filter_drawer',
  });

  const { activityTypes } = activityTypeStore;

  const sortingOptions = useMemo<Option<TaskSorting>[]>(() => getTasksSortingOptions(t), [t]);

  const activityTypesOptions = useMemo(
    () =>
      activityTypes.map<Option<number>>(at => ({
        label: at.name,
        value: at.id,
      })),
    [activityTypes]
  );

  const { data: stages } = stageApiUtil.useGetStagesByBoardId({ boardId });

  const stagesOptions = useMemo<Option<number, { bgColor: string }>[]>(
    () =>
      stages
        ? stages.map(s => ({
            label: s.name,
            value: s.id,
            extra: {
              bgColor: s.color,
            },
          }))
        : [],
    [stages]
  );

  const groupsOptions = useGetGroupOptions();

  return useMemo(
    () => ({
      sortingOptions,
      activityTypesOptions,
      stagesOptions,
      groupsOptions,
    }),
    [activityTypesOptions, groupsOptions, sortingOptions, stagesOptions]
  );
};
