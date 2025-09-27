import type { Meta, StoryObj } from '@storybook/react';
import { CreateIcon } from '../../../../assets';
import { RoundButton } from './RoundButton';

const meta = {
  title: 'shared/lib/components/Buttons/RoundButton',
  component: RoundButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RoundButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    Icon: <CreateIcon />,
    label: 'Create something',
  },
};
