import type { Meta, StoryObj } from '@storybook/react';
import { MiniLoader } from './MiniLoader';

const meta = {
  title: 'shared/lib/components/Loaders/MiniLoader',
  component: MiniLoader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    color: 'var(--primary-blue)',
  },
} satisfies Meta<typeof MiniLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'small',
  },
};
