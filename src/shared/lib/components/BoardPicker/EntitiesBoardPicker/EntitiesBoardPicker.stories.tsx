import type { Meta, StoryObj } from '@storybook/react';
import { Board, BoardType, SectionView, UserRights } from '../../../models';
import { EntitiesBoardPicker } from './EntitiesBoardPicker';

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
  title: 'shared/lib/components/BoardPicker/EntitiesBoardPicker',
  component: EntitiesBoardPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    activeBoardId: 0,
    entityTypeId: 0,
    linkType: 'common',
    boards: new Array(20).fill(0).map((_, i) => getMockBoard(i)),
    tab: SectionView.BOARD,
  },
} satisfies Meta<typeof EntitiesBoardPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
