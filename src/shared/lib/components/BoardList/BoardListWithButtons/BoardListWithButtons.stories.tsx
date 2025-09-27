import type { Meta, StoryObj } from '@storybook/react';
import { Board, BoardType, UserRights } from '../../../models';
import { BoardListWithButtons } from './BoardListWithButtons';

const getMockBoard = (id: number) => {
  return new Board({
    id,
    name: `Some board ${id}`,
    type: BoardType.TASK,
    ownerId: -1,
    isSystem: false,
    recordId: -1,
    participantIds: null,
    sortOrder: -1,
    taskBoardId: -1,
    userRights: new UserRights(true, true, true),
  });
};

const meta = {
  title: 'shared/lib/components/BoardList/BoardListWithButtons',
  component: BoardListWithButtons,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    activeBoardId: 0,
    maxHeight: '320px',
    boards: new Array(20).fill(0).map((_, i) => getMockBoard(i)),
    onBoardChange: () => {},
  },
} satisfies Meta<typeof BoardListWithButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
