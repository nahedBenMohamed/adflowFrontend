import { CreateBoardDto, boardApiUtil } from '@/app';
import { authStore } from '@/modules/auth';
import {
  BoardItemPrimary,
  BoardList,
  BoardListItemWrapper,
  BoardListRoot,
  BoardPicker,
  MathUtil,
  PickerButton,
  ProjectBoardIcon,
  TasksBoardIcon,
  type Board,
  type MySelectTitleRootVariant,
  type Nullable,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

interface Props {
  boards: Board[];
  activeBoardId: Nullable<number>;
  placeholder: string;
  disabled?: boolean;
  variant?: MySelectTitleRootVariant;
  onBoardSelect: (boardId: number) => void;
}

const TasksBoardSelector = observer((props: Props) => {
  const { boards, activeBoardId, placeholder, disabled = false, onBoardSelect } = props;

  const isAdmin = authStore.isAdmin();

  const [opened, { close, open, toggle }] = useDisclosure(false);

  const [isBoardAdding, setIsBoardAdding] = useState(false);

  const handleAddNew = async (boardName: string): Promise<void> => {
    try {
      setIsBoardAdding(true);

      // we want newly created board to be the last one in the list
      const maxSortOrder = MathUtil.maxOrZero(boards.map<number>(b => b.sortOrder));

      const createBoardDto = CreateBoardDto.forTasks({
        name: boardName,
        sortOrder: maxSortOrder + 1,
      });

      await boardApiUtil.addBoard(createBoardDto);
    } catch (e) {
      console.error(`Failed to add board: ${e}`);
    } finally {
      setIsBoardAdding(false);
    }
  };

  const handleSelectBoard = (boardId: number) => {
    onBoardSelect(boardId);

    close();
  };

  const sortedBoards = boards.sort((a, b) => a.sortOrder - b.sortOrder);

  const activeBoard = boards.find(board => board.id === activeBoardId);

  const activeBoardName = activeBoard ? activeBoard.name : placeholder;

  return (
    <BoardPicker
      disabled={disabled}
      activeBoard={activeBoardName}
      hideAddBoardControl={!isAdmin}
      isAdding={isBoardAdding}
      overrideShowHideHandlers={{ opened, show: open, hide: close }}
      CustomButton={
        <PickerButton
          active={opened}
          variant="secondary"
          width="fit-content"
          disabled={disabled}
          iconOutlined={false}
          value={activeBoardName}
          Icon={<ProjectBoardIcon />}
          selectedValue={Boolean(activeBoardId)}
          onClick={toggle}
        />
      }
      handleAddNewBoard={handleAddNew}
    >
      <BoardListRoot $maxHeight="304px">
        <BoardList>
          {sortedBoards.map(b => (
            <BoardListItemWrapper key={b.id}>
              <BoardItemPrimary
                board={b}
                hasEditMode
                Icon={<TasksBoardIcon />}
                activeBoardId={activeBoardId}
                onBoardChange={handleSelectBoard}
              />
            </BoardListItemWrapper>
          ))}
        </BoardList>
      </BoardListRoot>
    </BoardPicker>
  );
});

TasksBoardSelector.displayName = 'TasksBoardSelector';
export { TasksBoardSelector };
