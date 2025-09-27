import type { Meta, StoryObj } from '@storybook/react';
import { DeleteButton } from './DeleteButton';

const meta = {
  title: 'shared/lib/components/Buttons/DeleteButton',
  component: DeleteButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DeleteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithText: Story = {
  args: {
    text: 'Delete something',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};
