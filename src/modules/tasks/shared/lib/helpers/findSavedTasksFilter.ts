import { SettingsStore } from '@/app';
import type { Nullable, Optional } from '@/shared';
import { TASKS_CARDS_FILTER_SETTINGS_KEY } from '../components';
import type { TaskBoardFilter, TasksCardsFilterSettings, TasksFilterType } from '../models';

export const findSavedTasksFilter = ({
  filterType,
  boardId,
}: {
  filterType: TasksFilterType;
  boardId: Nullable<number>;
}): Optional<TaskBoardFilter> => {
  const { settings } = SettingsStore.getSettingsStore<{
    filters: TasksCardsFilterSettings[];
  }>(TASKS_CARDS_FILTER_SETTINGS_KEY);

  const savedFilter = settings.filters?.find(
    f => f.filterType === filterType && f.boardId === boardId
  )?.filter;

  return savedFilter;
};
