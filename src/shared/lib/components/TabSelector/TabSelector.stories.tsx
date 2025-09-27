import type { Meta, StoryObj } from '@storybook/react';
import { TabSelector } from './TabSelector';

const meta = {
  title: 'shared/lib/components/TabSelector',
  component: TabSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <TabSelector.Tab calculateActiveStrategy="always-inactive" name="Tab 1" to="/" />
        <TabSelector.Tab calculateActiveStrategy="always-active" name="Always active tab" to="/1" />
        <TabSelector.Tab calculateActiveStrategy="always-inactive" name="Tab 2" to="/2" />
        <TabSelector.Tab calculateActiveStrategy="always-inactive" name="Tab 3" to="/3" />
        <TabSelector.Tab calculateActiveStrategy="always-inactive" name="Tab 4" to="/4" />
      </>
    ),
  },
} satisfies Meta<typeof TabSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Skeleton: Story = {
  args: {
    children: (
      <>
        <TabSelector.Skeleton />
        <TabSelector.Skeleton />
        <TabSelector.Skeleton />
        <TabSelector.Skeleton />
      </>
    ),
  },
};
