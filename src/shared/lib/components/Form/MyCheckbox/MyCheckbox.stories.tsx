import type { Meta, StoryObj } from '@storybook/react';
import { MyCheckbox } from './MyCheckbox';

const meta = {
  title: 'shared/lib/components/Form/MyCheckbox',
  component: MyCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryUnchecked: Story = {
  args: {
    variant: 'primary',
    checked: false,
  },
};

export const PrimaryUncheckedBigger: Story = {
  args: {
    checked: false,
    variant: 'bigger',
  },
};

export const PrimaryChecked: Story = {
  args: {
    variant: 'primary',
    checked: true,
  },
};

export const PrimaryCheckedBigger: Story = {
  args: {
    checked: true,
    variant: 'bigger',
  },
};

export const PrimaryIndeterminate: Story = {
  args: {
    variant: 'primary',
    indeterminate: true,
  },
};

export const MarkUnchecked: Story = {
  args: {
    variant: 'mark',
    checked: false,
  },
};

export const MarkChecked: Story = {
  args: {
    variant: 'mark',
    checked: true,
  },
};

export const MarkIndeterminate: Story = {
  args: {
    variant: 'mark',
    indeterminate: true,
  },
};
