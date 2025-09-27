import type { Meta, StoryObj } from '@storybook/react';
import { MySwitch } from './MySwitch';

const meta = {
  title: 'shared/lib/components/Form/MySwitch',
  component: MySwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    checked: false,
    onChange: () => {},
  },
} satisfies Meta<typeof MySwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};
