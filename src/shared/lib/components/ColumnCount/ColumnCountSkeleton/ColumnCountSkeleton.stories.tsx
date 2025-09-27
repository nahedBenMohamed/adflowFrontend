import type { Meta, StoryObj } from '@storybook/react';
import { ColumnCountSkeleton } from './ColumnCountSkeleton';

const meta = {
  title: 'shared/lib/components/ColumnCount/ColumnCountSkeleton',
  component: ColumnCountSkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof ColumnCountSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Medium: Story = {
  args: {
    $medium: true,
  },
};
