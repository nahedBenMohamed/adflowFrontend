import type { Meta, StoryObj } from '@storybook/react';
import { InputModel } from '../../../models';
import { MyRadio } from './MyRadio';

const mockValue = 'value';

const meta = {
  title: 'shared/lib/components/Form/MyRadio',
  component: MyRadio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    value: mockValue,
    model: InputModel.create(mockValue),
  },
} satisfies Meta<typeof MyRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Danger: Story = {
  args: {
    colorType: 'danger',
  },
};

export const Success: Story = {
  args: {
    colorType: 'success',
  },
};

export const Gray: Story = {
  args: {
    colorType: 'gray',
  },
};

export const Unselected: Story = {
  args: {
    model: InputModel.create(''),
  },
};
