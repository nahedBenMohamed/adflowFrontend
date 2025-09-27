import { CreateBoardDto, boardApiUtil } from '@/app';
import { authStore } from '@/modules/auth';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { isPathnameOnEntitySection } from '../../../helpers';
import { PREV_PAGE_QUERY_PARAM, type Board, type SectionView } from '../../../models';
import type { EntityBoardLinkType } from '../../../types';
import { UriCodingUtil } from '../../../utils';
import { BoardListWithLinks } from '../../BoardList/BoardListWithLinks/BoardListWithLinks';
import { BoardPicker } from '../components';

interface Props {
  boards: Board[];
  activeBoardId: number;
  entityTypeId: number;
  tab?: SectionView;
  linkType?: EntityBoardLinkType;
}

const EntitiesBoardPicker = observer((props: Props) => {
  const { entityTypeId, boards, activeBoardId, tab, linkType = 'common' } = props;

  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const [isBoardAdding, setIsBoardAdding] = useState(false);

  const isOnEntitiesSection = useMemo<boolean>(
    (): boolean =>
      isPathnameOnEntitySection({
        pathname,
        entityTypeId,
      }),
    [pathname, entityTypeId]
  );

  const fromPage = searchParams.get(PREV_PAGE_QUERY_PARAM);
  const fromPageEncoded = fromPage ? UriCodingUtil.encode(fromPage) : undefined;

  const isAdmin = authStore.isAdmin();

  const handleAddNew = useCallback(
    async (boardName: string) => {
      try {
        setIsBoardAdding(true);

        // we want newly created board to be the last one in the list
        const maxSortOrder = Math.max(...boards.map<number>(b => b.sortOrder));

        const newBoardApiModel = CreateBoardDto.forEntityType({
          name: boardName,
          sortOrder: maxSortOrder + 1,
          entityTypeId,
        });

        await boardApiUtil.addBoard(newBoardApiModel);
      } catch (e) {
        console.error(`Failed to add board: ${e}`);
      } finally {
        setIsBoardAdding(false);
      }
    },
    [boards, entityTypeId]
  );

  const boardName = boards.find(b => b.id === activeBoardId)?.name;

  if (!boardName) return null;

  return (
    <BoardPicker
      activeBoard={boardName}
      variant="outlined-secondary"
      hideAddBoardControl={!isAdmin}
      isAdding={isBoardAdding}
      handleAddNewBoard={handleAddNew}
    >
      <BoardListWithLinks
        boards={boards}
        maxHeight="400px"
        linkType={linkType}
        isDraggable={isAdmin}
        hasEditMode={isAdmin}
        entityTypeId={entityTypeId}
        activeBoardId={activeBoardId}
        fromPageEncoded={fromPageEncoded}
        // Tab is only used when we're changing boards from entities sections to preserve current active tab.
        // e.g. we're on entities board page -> list tab -> changing board -> we're on another board on the same list tab.
        // In other cases we don't need to pass tab to BoardListWithLinks, because it could lead to errors (such
        // as when we're on page which also has tab path param, let's say "Overview", and we don't want to pass it because
        // on entities section page it will lead to blank screen).
        tabFromParams={isOnEntitiesSection ? tab : undefined}
      />
    </BoardPicker>
  );
});

EntitiesBoardPicker.displayName = 'EntitiesBoardPicker';
export { EntitiesBoardPicker };
