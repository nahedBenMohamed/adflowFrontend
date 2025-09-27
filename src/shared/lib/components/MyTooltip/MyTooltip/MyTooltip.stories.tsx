/* eslint-disable i18next/no-literal-string */

import type { Meta, StoryObj } from '@storybook/react';
import { PrimaryButton } from '../../Buttons/PrimaryButton/PrimaryButton';
import { MyTooltip } from './MyTooltip';

const meta = {
  title: 'shared/lib/components/MyTooltip',
  component: MyTooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withinPortal: true,
    label: 'Some tooltip text',
    children: (
      <div>
        <PrimaryButton variant="outlined">Hover me</PrimaryButton>
      </div>
    ),
  },
} satisfies Meta<typeof MyTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
