import type { Meta, StoryObj } from '@storybook/react';
import { generateMockOptions } from '../../../helpers';
import { MultiselectModel } from '../../../models';
import { MultiselectWithCheckboxes } from './MultiselectWithCheckboxes';

const meta = {
  title: 'shared/lib/components/Form/MultiselectWithCheckboxes',
  component: MultiselectWithCheckboxes,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withinPortal: true,
    width: '320px',
    model: MultiselectModel.createFromNullable(null),
    placeholder: 'Select options',
    options: generateMockOptions(20),
  },
} satisfies Meta<typeof MultiselectWithCheckboxes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
