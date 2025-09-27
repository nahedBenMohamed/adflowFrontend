import type { Meta, StoryObj } from '@storybook/react';
import { BoardItemSecondary } from './BoardItemSecondary';

const meta = {
  title: 'shared/lib/components/BoardItem/BoardItemSecondary',
  component: BoardItemSecondary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    link: '/',
    name: 'Some board',
  },
} satisfies Meta<typeof BoardItemSecondary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
