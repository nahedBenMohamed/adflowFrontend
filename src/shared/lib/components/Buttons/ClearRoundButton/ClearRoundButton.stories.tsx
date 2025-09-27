import type { Meta, StoryObj } from '@storybook/react';
import { ClearRoundButton } from './ClearRoundButton';

const meta = {
  title: 'shared/lib/components/Buttons/ClearRoundButton',
  component: ClearRoundButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ClearRoundButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
