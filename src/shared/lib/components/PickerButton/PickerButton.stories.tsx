import type { Meta, StoryObj } from '@storybook/react';
import { BurgerIcon } from '../../../assets';
import { PickerButton } from './PickerButton';

const meta = {
  title: 'shared/lib/components/PickerButton',
  component: PickerButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    Icon: <BurgerIcon />,
    value: 'Pick a value',
  },
} satisfies Meta<typeof PickerButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
