import type { EntityType, Nullable, SectionPaginationProps } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer } from 'react';
import styled from 'styled-components';
import { EntitiesListSettingsStore, type EntitiesListPageStore } from '../../../../store';
import type { EntityBoardCardFilter } from '../../models';
import { SectionTable } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-bottom: 16px;
`;

interface Props {
  et: EntityType;
  filter: EntityBoardCardFilter;
  currentPage: number;
  totalCount: number;
  settingsOpened: boolean;
  currentPageEncodedUrl: string;
  showBoardName?: boolean;
  entitiesListPageStore: EntitiesListPageStore;
  boardId?: Nullable<number>;
  savedFilter?: EntityBoardCardFilter;
  onPageChange: (page: number) => void;
  handleCloseSettings: () => void;
}

const EntitiesList = observer((props: Props) => {
  const {
    et,
    filter,
    currentPage,
    totalCount,
    settingsOpened,
    boardId = null,
    showBoardName,
    currentPageEncodedUrl,
    entitiesListPageStore,
    savedFilter,
    onPageChange,
    handleCloseSettings,
  } = props;

  const [tableKey, forceTableRerender] = useReducer(x => ++x, 0);

  const { pageCount, loadData, reset } = entitiesListPageStore;

  const entitiesListSettingsStore = useMemo(
    () =>
      new EntitiesListSettingsStore({
        boardId,
        entityTypeId: et.id,
      }),
    [et, boardId]
  );

  useEffect(() => {
    entitiesListSettingsStore.loadData();
  }, [entitiesListSettingsStore]);

  useLayoutEffect(() => {
    loadData({ page: currentPage, boardId, filter: savedFilter ?? {} });
    // loadData should be triggered once on component mount or boardId change to load initial data,
    // handlePageChange will trigger loadData on page change, filter changes will also trigger it's own loadData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, savedFilter, loadData, reset]);

  const handleReload = useCallback(
    () => entitiesListPageStore.loadData({ filter, page: currentPage, boardId }),
    [boardId, currentPage, filter, entitiesListPageStore]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      loadData({ filter, page, boardId });
      onPageChange(page);
    },
    [boardId, filter, onPageChange, loadData]
  );

  const paginationProps = useMemo<SectionPaginationProps>(
    () => ({
      pageCount,
      currentPage,
      handleChange: handlePageChange,
    }),
    [currentPage, pageCount, handlePageChange]
  );

  const {
    entities,
    isLoaded,
    changeName,
    changeStage,
    changeFieldValue,
    changeResponsible,
    showMutationWarning,
  } = entitiesListPageStore;

  return (
    <Root>
      <SectionTable
        key={tableKey}
        entityType={et}
        filter={filter}
        boardId={boardId}
        entities={entities}
        isLoaded={isLoaded}
        totalCount={totalCount}
        showBoardName={showBoardName}
        settingsOpened={settingsOpened}
        paginationProps={paginationProps}
        currentPageEncodedUrl={currentPageEncodedUrl}
        entitiesListSettingsStore={entitiesListSettingsStore}
        reload={handleReload}
        handleChangeName={changeName}
        handleChangeStage={changeStage}
        forceRerender={forceTableRerender}
        closeSettings={handleCloseSettings}
        handleChangeFieldValue={changeFieldValue}
        showMutationWarning={showMutationWarning}
        handleChangeResponsible={changeResponsible}
      />
    </Root>
  );
});

EntitiesList.displayName = 'EntitiesList';
export { EntitiesList };
