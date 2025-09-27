import type { Meta, StoryObj } from '@storybook/react';
import { Hint } from './Hint';

const meta = {
  title: 'shared/lib/components/Hint',
  component: Hint,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequatur quo dolor unde minus. Debitis magnam eligendi ratione cumque quae non.',
  },
} satisfies Meta<typeof Hint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
