import { observer } from 'mobx-react-lite';
import { ProjectBoardIcon } from '../../../../assets';
import type { Board } from '../../../models';
import type { Nullable } from '../../../types';
import { BoardItemPrimary } from '../../BoardItem/BoardItemPrimary/BoardItemPrimary';
import { BoardListItemWrapper, BoardListRoot } from '../components';

interface Props {
  boards: Board[];
  activeBoardId: Nullable<number>;
  maxHeight?: string;
  onBoardChange: (boardId: number) => void;
}

const BoardListWithButtons = observer((props: Props) => {
  const { boards, activeBoardId, maxHeight, onBoardChange } = props;

  const sortedBoards = boards.sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <BoardListRoot $maxHeight={maxHeight}>
      {sortedBoards.map(board => (
        <BoardListItemWrapper key={board.id}>
          <BoardItemPrimary
            hasEditMode={false}
            board={board}
            Icon={<ProjectBoardIcon />}
            activeBoardId={activeBoardId}
            onBoardChange={onBoardChange}
          />
        </BoardListItemWrapper>
      ))}
    </BoardListRoot>
  );
});

BoardListWithButtons.displayName = 'BoardListWithButtons';
export { BoardListWithButtons };
