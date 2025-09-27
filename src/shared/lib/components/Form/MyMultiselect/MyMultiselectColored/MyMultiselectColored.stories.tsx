import type { Meta, StoryObj } from '@storybook/react';
import { generateMockOptions } from '../../../../helpers';
import { MultiselectModel } from '../../../../models';
import { MyMultiselectColored } from './MyMultiselectColored';

const meta = {
  title: 'shared/lib/components/Form/MyMultiselect/MyMultiselectColored',
  component: MyMultiselectColored,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withinPortal: true,
    model: MultiselectModel.createFromNullable(null),
    placeholder: 'Select options',
    options: generateMockOptions(10),
  },
} satisfies Meta<typeof MyMultiselectColored>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
