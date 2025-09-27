import type { Meta, StoryObj } from '@storybook/react';
import { TotalTag } from './TotalTag';

const meta = {
  title: 'shared/lib/components/TotalTag',
  component: TotalTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    total: 100,
  },
} satisfies Meta<typeof TotalTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
