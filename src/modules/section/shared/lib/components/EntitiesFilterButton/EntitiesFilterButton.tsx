import { SettingsStore } from '@/app/store/SettingsStore';
import { FilterButtonWithClearIconTemplate, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useReducer, useRef, useState } from 'react';
import type {
  EntitiesFilterDrawerAsyncStateProps,
  EntityBoardCardFilter,
  EntityCardsFilterSettings,
} from '../../models';
import { EntitiesFilterDrawer } from './components';

interface Props {
  boardId: Nullable<number>;
  entityTypeId: number;
  filter: EntityBoardCardFilter;
  loadData: (filter: EntityBoardCardFilter) => Promise<void>;
}

export const ENTITY_CARDS_FILTER_SETTINGS_KEY = 'EntityCardsFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{ filters: EntityCardsFilterSettings[] }>(
  ENTITY_CARDS_FILTER_SETTINGS_KEY
);

const EntitiesFilterButton = observer((props: Props) => {
  const { boardId, entityTypeId, filter, loadData } = props;

  const [buttonKey, forceRootRerender] = useReducer(x => ++x, 0);
  const [opened, { toggle, close: hide }] = useDisclosure(false);

  const [filterApplying, setFilterApplying] = useState(false);
  const [filterClearing, setFilterClearing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const isFilterApplied = useMemo<boolean>(() => Object.values(filter).some(Boolean), [filter]);

  const handleApplyFilter = useCallback(
    async (filter: EntityBoardCardFilter): Promise<void> => {
      setHasError(false);

      try {
        setFilterApplying(true);

        await loadData(filter);
      } catch (e) {
        setHasError(true);
      } finally {
        setFilterApplying(false);
      }
    },
    [loadData]
  );

  const handleClearFilter = useCallback(async (): Promise<void> => {
    setHasError(false);
    forceRootRerender();

    settings.filters = settings.filters?.filter(
      s => s.entityTypeId !== entityTypeId || s.boardId !== boardId
    );

    try {
      setFilterClearing(true);

      await loadData({});
    } catch (e) {
      setHasError(true);
    } finally {
      setFilterClearing(false);
    }
  }, [boardId, entityTypeId, loadData]);

  const asyncStateProps = useMemo<EntitiesFilterDrawerAsyncStateProps>(
    () => ({
      hasError,
      filterClearing,
      applyFilter: handleApplyFilter,
      clearFilter: handleClearFilter,
    }),
    [hasError, filterClearing, handleApplyFilter, handleClearFilter]
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
      <EntitiesFilterDrawer
        opened={opened}
        boardId={boardId}
        settings={settings}
        buttonRef={buttonRef}
        entityTypeId={entityTypeId}
        asyncStateProps={asyncStateProps}
        hide={hide}
      />
    </FilterButtonWithClearIconTemplate>
  );
});

EntitiesFilterButton.displayName = 'EntitiesFilterButton';
export { EntitiesFilterButton };
