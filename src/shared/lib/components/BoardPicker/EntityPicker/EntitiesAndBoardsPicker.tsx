import { CreateBoardDto, boardApiUtil, entityTypeStore } from '@/app';
import { authStore } from '@/modules/auth';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import { isPathnameOnEntitySection } from '../../../helpers';
import { PREV_PAGE_QUERY_PARAM, type EntityType, type SectionView } from '../../../models';
import type { EntityBoardLinkType, Nullable } from '../../../types';
import { UriCodingUtil } from '../../../utils';
import { BoardPicker } from '../components';
import { EntitiesAndBoardsList } from './components';

interface Props {
  et: EntityType;
  activeBoardId?: number;
  tab: Nullable<SectionView>;
  linkType?: EntityBoardLinkType;
  isOnlyOneEntityType?: boolean;
}

const EntitiesAndBoardsPicker = observer((props: Props) => {
  const { et, activeBoardId, tab, linkType, isOnlyOneEntityType } = props;

  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const [isBoardAdding, setIsBoardAdding] = useState(false);

  const { data: activeBoard } = boardApiUtil.useGetBoard(activeBoardId);

  const isOnEntitiesSection = useMemo<boolean>(
    () =>
      isPathnameOnEntitySection({
        pathname,
        entityTypeId: et.id,
      }),
    [pathname, et.id]
  );

  const fromPage = searchParams.get(PREV_PAGE_QUERY_PARAM);
  const fromPageEncoded = fromPage ? UriCodingUtil.encode(fromPage) : undefined;

  const entityTypes = entityTypeStore.getAvailableEntityTypes();
  const entityTypesSameCategory = isOnlyOneEntityType
    ? [et]
    : entityTypes.filter(entityType => entityType.entityCategory === et.entityCategory);

  const isAdmin = authStore.isAdmin();

  const handleAddNew = useCallback(
    async (boardName: string) => {
      try {
        setIsBoardAdding(true);

        const newBoardApiModel = CreateBoardDto.forEntityType({
          name: boardName,
          entityTypeId: et.id,
        });

        await boardApiUtil.addBoard(newBoardApiModel);
      } catch (e) {
        console.error(`Failed to add board: ${e}`);
      } finally {
        setIsBoardAdding(false);
      }
    },
    [et.id]
  );

  const activeModuleName = isOnlyOneEntityType
    ? t('all_cards')
    : activeBoard
      ? activeBoard.name
      : et.name;

  return (
    <BoardPicker
      variant="outlined-secondary"
      activeBoard={activeModuleName}
      isAdding={isBoardAdding}
      hideAddBoardControl={!activeBoardId || !isAdmin}
      handleAddNewBoard={handleAddNew}
    >
      <EntitiesAndBoardsList
        maxHeight="400px"
        linkType={linkType}
        isDraggable={isAdmin}
        activeBoardId={activeBoardId}
        hasBoardNameEditMode={isAdmin}
        fromPageEncoded={fromPageEncoded}
        entityTypes={entityTypesSameCategory}
        // Tab is only used when we're changing boards from entities sections to preserve current active tab.
        // e.g. we're on entities board page -> list tab -> changing board -> we're on another board on the same list tab.
        // In other cases we don't need to pass tab to BoardListWithLinks, because it could lead to errors (such
        // as when we're on page which also has tab path param, let's say "Overview", and we don't want to pass it because
        // on entities section page it will lead to blank screen).
        currentTab={isOnEntitiesSection ? tab : null}
      />
    </BoardPicker>
  );
});

EntitiesAndBoardsPicker.displayName = 'EntitiesAndBoardsPicker';
export { EntitiesAndBoardsPicker };
