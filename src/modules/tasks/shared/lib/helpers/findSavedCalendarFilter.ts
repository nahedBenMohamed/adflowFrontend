import { SettingsStore } from '@/app';
import type { Nullable, Optional } from '@/shared';
import { TASKS_CALENDAR_FILTER_SETTINGS_KEY } from '../components';
import type { TasksCardsFilterSettings, TasksFilterType } from '../models';

export const findSavedCalendarFilter = ({
  filterType,
  boardId,
}: {
  filterType: TasksFilterType;
  boardId: Nullable<number>;
}): Optional<TasksCardsFilterSettings> => {
  const { settings } = SettingsStore.getSettingsStore<{ filters: TasksCardsFilterSettings[] }>(
    TASKS_CALENDAR_FILTER_SETTINGS_KEY
  );

  return settings.filters
    ? settings.filters.find(s => s.filterType === filterType && s.boardId === boardId)
    : undefined;
};
