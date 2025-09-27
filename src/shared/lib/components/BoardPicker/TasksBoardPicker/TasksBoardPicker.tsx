import { CreateBoardDto, boardApiUtil, routes } from '@/app';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useTypedParams } from '../../../hooks';
import { PREV_PAGE_QUERY_PARAM, type Board } from '../../../models';
import type { Nullable } from '../../../types';
import { UriCodingUtil } from '../../../utils';
import { TasksBoardList } from '../../BoardList/TasksBoardList/TasksBoardList';
import { BoardPicker } from '../components';

interface Props {
  boards: Board[];
  activeBoardId: Nullable<number>;
  linkOnSettings?: boolean;
}

const TasksBoardPicker = observer((props: Props) => {
  const { boards, activeBoardId, linkOnSettings } = props;

  const { t } = useTranslation();

  const [isBoardAdding, setIsBoardAdding] = useState(false);

  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { entityId, entityTypeId } = useTypedParams<{ entityId?: number; entityTypeId?: number }>();

  const fromPage = searchParams.get(PREV_PAGE_QUERY_PARAM);
  const fromPageEncoded = fromPage ? UriCodingUtil.encode(fromPage) : undefined;

  const handleAddNew = useCallback(
    async (boardName: string): Promise<void> => {
      setIsBoardAdding(true);

      // we want newly created board to be the last one in the list
      const maxSortOrder = Math.max(...boards.map<number>(b => b.sortOrder));

      const newBoardApiModel = CreateBoardDto.forTasks({
        name: boardName,
        sortOrder: maxSortOrder + 1,
      });

      await boardApiUtil.addBoard(newBoardApiModel);

      setIsBoardAdding(false);
    },
    [boards]
  );

  const getName = useCallback(
    (activeBoardId: Nullable<number>): string => {
      if (pathname.includes(routes.activitiesBase)) return t('activities');

      if (pathname.includes(routes.timeBoardBase())) return t('time_board');

      if (!activeBoardId)
        throw new Error(
          `Failed to get board name, activeBoardId is not defined, received ${activeBoardId}`
        );

      return boards.find(b => b.id === activeBoardId)?.name ?? '';
    },
    [boards, pathname, t]
  );

  const name = getName(activeBoardId);

  return (
    <BoardPicker
      activeBoard={name}
      variant="outlined-secondary"
      isAdding={isBoardAdding}
      handleAddNewBoard={handleAddNew}
    >
      <TasksBoardList
        hasEditMode
        boards={boards}
        maxHeight="400px"
        entityId={entityId}
        entityTypeId={entityTypeId}
        activeBoardId={activeBoardId}
        linkOnSettings={linkOnSettings}
        fromPageEncoded={fromPageEncoded}
      />
    </BoardPicker>
  );
});

TasksBoardPicker.displayName = 'TasksBoardPicker';
export { TasksBoardPicker };
