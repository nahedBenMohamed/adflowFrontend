import type { Meta, StoryObj } from '@storybook/react';
import { SaveCancelButtons } from './SaveCancelButtons';

const meta = {
  title: 'shared/lib/components/Buttons/SaveCancelButtons',
  component: SaveCancelButtons,
  parameters: {
    layout: 'centered',
  },
  args: {
    handleSave: () => {},
    handleCancel: () => {},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SaveCancelButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
