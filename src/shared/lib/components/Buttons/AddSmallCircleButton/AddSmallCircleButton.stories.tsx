import type { Meta, StoryObj } from '@storybook/react';
import { AddSmallCircleButton } from './AddSmallCircleButton';

const meta = {
  title: 'shared/lib/components/Buttons/AddSmallCircleButton',
  component: AddSmallCircleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AddSmallCircleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bigger: Story = {
  args: {
    bigger: true,
  },
};
