import type { Meta, StoryObj } from '@storybook/react';
import { MyEmojiPicker } from './MyEmojiPicker';

const meta = {
  title: 'shared/lib/components/MyEmojiPicker',
  component: MyEmojiPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withinPortal: true,
    onSelect: () => {},
  },
} satisfies Meta<typeof MyEmojiPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
