import type { Meta, StoryObj } from '@storybook/react';
import { ExpandButton } from './ExpandButton';

const meta = {
  title: 'shared/lib/components/ExpandButton',
  component: ExpandButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    expanded: false,
    onClick: () => {},
  },
} satisfies Meta<typeof ExpandButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
