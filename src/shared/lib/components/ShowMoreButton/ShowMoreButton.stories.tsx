import type { Meta, StoryObj } from '@storybook/react';
import { ShowMoreButton } from './ShowMoreButton';

const meta = {
  title: 'shared/lib/components/ShowMoreButton',
  component: ShowMoreButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    active: true,
    onClick: () => {},
  },
} satisfies Meta<typeof ShowMoreButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
