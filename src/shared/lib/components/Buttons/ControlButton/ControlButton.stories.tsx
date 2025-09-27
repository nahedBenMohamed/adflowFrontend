import type { Meta, StoryObj } from '@storybook/react';
import { ControlButton } from './ControlButton';

const meta = {
  title: 'shared/lib/components/Buttons/ControlButton',
  component: ControlButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof ControlButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'save',
  },
};

export const Cancel: Story = {
  args: {
    variant: 'cancel',
  },
};
