import type { Meta, StoryObj } from '@storybook/react';
import { PlusIconButton } from './PlusIconButton';

const meta = {
  title: 'shared/lib/components/Buttons/PlusIconButton',
  component: PlusIconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    text: 'Add something',
    onClick: () => {},
  },
} satisfies Meta<typeof PlusIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
