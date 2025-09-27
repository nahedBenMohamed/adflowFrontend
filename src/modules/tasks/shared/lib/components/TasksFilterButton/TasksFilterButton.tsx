import { SettingsStore } from '@/app';
import { FilterButtonWithClearIconTemplate, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useReducer, useRef, useState } from 'react';
import type {
  TaskBoardFilter,
  TaskFilterDrawerAsyncStateProps,
  TasksCardsFilterSettings,
  TasksFilterType,
} from '../../models';
import { TasksFilterDrawer } from './components';

interface Props {
  filter: TaskBoardFilter;
  boardId: Nullable<number>;
  filterType: TasksFilterType;
  hideEntitiesSearchBlock?: boolean;
  loadData: (filter: TaskBoardFilter) => Promise<void>;
  setFilter?: (filter: TaskBoardFilter) => void;
}

export const TASKS_CARDS_FILTER_SETTINGS_KEY = 'TasksCardsFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{ filters: TasksCardsFilterSettings[] }>(
  TASKS_CARDS_FILTER_SETTINGS_KEY
);

const TasksFilterButton = observer((props: Props) => {
  const { filter, boardId, filterType, hideEntitiesSearchBlock, loadData, setFilter } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [buttonKey, forceRootRerender] = useReducer(x => ++x, 0);

  const [opened, { toggle, close }] = useDisclosure(false);

  const [filterApplying, setFilterApplying] = useState(false);
  const [filterClearing, setFilterClearing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isFilterApplied = filter && Object.values(filter).some(Boolean);

  const handleApplyFilter = useCallback(
    async (filter: TaskBoardFilter): Promise<void> => {
      setHasError(false);
      setFilter?.(filter);

      try {
        setFilterApplying(true);

        await loadData(filter);
      } catch (e) {
        setHasError(true);
      } finally {
        setFilterApplying(false);
      }
    },
    [loadData, setFilter]
  );

  const handleClearFilter = useCallback(async (): Promise<void> => {
    setHasError(false);
    forceRootRerender();

    settings.filters = settings.filters?.filter(
      s => s.filterType !== filterType || s.boardId !== boardId
    );

    try {
      setFilterClearing(true);

      setFilter?.({});

      await loadData({});
    } catch (e) {
      setHasError(true);
    } finally {
      setFilterClearing(false);
    }
  }, [filterType, boardId, setFilter, loadData]);

  const drawerAsyncStateProps = useMemo<TaskFilterDrawerAsyncStateProps>(
    () => ({
      hasError,
      filterClearing,
      applyFilter: handleApplyFilter,
      clearFilter: handleClearFilter,
    }),
    [filterClearing, hasError, handleApplyFilter, handleClearFilter]
  );

  return (
    <FilterButtonWithClearIconTemplate
      key={buttonKey}
      ref={buttonRef}
      opened={opened}
      isFilterApplied={isFilterApplied}
      loading={filterApplying || filterClearing}
      toggle={toggle}
      handleClear={handleClearFilter}
    >
      <TasksFilterDrawer
        opened={opened}
        boardId={boardId}
        settings={settings}
        buttonRef={buttonRef}
        filter={filter}
        filterType={filterType}
        asyncStateProps={drawerAsyncStateProps}
        hideEntitiesSearchBlock={hideEntitiesSearchBlock}
        hide={close}
      />
    </FilterButtonWithClearIconTemplate>
  );
});

TasksFilterButton.displayName = 'TasksFilterButton';
export { TasksFilterButton };
