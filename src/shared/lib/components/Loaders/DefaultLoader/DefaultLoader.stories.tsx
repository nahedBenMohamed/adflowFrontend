import type { Meta, StoryObj } from '@storybook/react';
import { DefaultLoader } from './DefaultLoader';

const meta = {
  title: 'shared/lib/components/Loaders/DefaultLoader',
  component: DefaultLoader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof DefaultLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
