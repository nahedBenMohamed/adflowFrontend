import type { Meta, StoryObj } from '@storybook/react';
import { Board, BoardType, UserRights } from '../../../models';
import { BoardItemPrimary } from './BoardItemPrimary';

const mockBoard = new Board({
  id: -1,
  name: 'Some board',
  type: BoardType.TASK,
  ownerId: -1,
  isSystem: false,
  recordId: -1,
  participantIds: null,
  sortOrder: -1,
  taskBoardId: -1,
  userRights: new UserRights(true, true, true),
});

const meta = {
  title: 'shared/lib/components/BoardItem/BoardItemPrimary',
  component: BoardItemPrimary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    board: mockBoard,
    activeBoardId: -1,
    hasEditMode: true,
  },
} satisfies Meta<typeof BoardItemPrimary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
