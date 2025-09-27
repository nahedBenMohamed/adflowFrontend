import type { Meta, StoryObj } from '@storybook/react';
import { FileInput } from './FileInput';

const meta = {
  title: 'shared/lib/components/FileInput',
  component: FileInput,
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: () => {},
    onDelete: () => {},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconSmall: Story = {
  args: {
    as: 'icon-small',
  },
};

export const IconLarge: Story = {
  args: {
    as: 'icon-large',
  },
};
