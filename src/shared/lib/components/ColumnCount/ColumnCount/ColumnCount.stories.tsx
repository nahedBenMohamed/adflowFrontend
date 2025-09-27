import type { Meta, StoryObj } from '@storybook/react';
import { ColumnCount } from './ColumnCount';

const meta = {
  title: 'shared/lib/components/ColumnCount/ColumnCount',
  component: ColumnCount,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    count: 100,
  },
} satisfies Meta<typeof ColumnCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
