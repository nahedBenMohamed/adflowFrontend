import type { Meta, StoryObj } from '@storybook/react';
import { LinkedEntityTag } from './LinkedEntityTag';

const meta = {
  title: 'shared/lib/components/LinkedEntityTag',
  component: LinkedEntityTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Linked entity',
    to: '/',
  },
} satisfies Meta<typeof LinkedEntityTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
