import type { Meta, StoryObj } from '@storybook/react';
import { generateMockOptions } from '../../../../helpers';
import { SelectModel } from '../../../../models';
import { MySelectColored } from './MySelectColored';

const meta = {
  title: 'shared/lib/components/Form/MySelect/MySelectColored',
  component: MySelectColored,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    width: 240,
    withinPortal: true,
    placeholder: 'Select option',
    model: SelectModel.create(),
    options: generateMockOptions(20),
  },
} satisfies Meta<typeof MySelectColored>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
