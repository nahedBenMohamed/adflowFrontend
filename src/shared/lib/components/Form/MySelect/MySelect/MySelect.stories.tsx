import type { Meta, StoryObj } from '@storybook/react';
import { generateMockOptions } from '../../../../helpers';
import { SelectModel } from '../../../../models';
import { MySelect } from './MySelect';

const meta = {
  title: 'shared/lib/components/Form/MySelect/MySelect',
  component: MySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withinPortal: true,
    width: '320px',
    placeholder: 'Select option',
    model: SelectModel.create(),
    options: generateMockOptions(20),
  },
} satisfies Meta<typeof MySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    variant: 'empty',
  },
};

export const EmptySmall: Story = {
  args: {
    variant: 'empty-small',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};
