import type { Meta, StoryObj } from '@storybook/react';
import { InputModel } from '../../../../models';
import { MyInput } from './MyInput';

const meta = {
  title: 'shared/lib/components/Form/MyInput',
  component: MyInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    width: '320px',
    model: InputModel.create('Some value'),
    placeholder: 'Enter value',
  },
} satisfies Meta<typeof MyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    variant: 'filled',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    alwaysActive: true,
  },
};
