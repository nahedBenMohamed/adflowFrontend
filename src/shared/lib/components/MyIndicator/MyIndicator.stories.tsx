/* eslint-disable i18next/no-literal-string */

import type { Meta, StoryObj } from '@storybook/react';
import { PrimaryButton } from '../Buttons/PrimaryButton/PrimaryButton';
import { MyIndicator } from './MyIndicator';

const meta = {
  title: 'shared/lib/components/MyIndicator',
  component: MyIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    size: 20,
    label: 10,
    children: <PrimaryButton>With indicator</PrimaryButton>,
  },
} satisfies Meta<typeof MyIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
