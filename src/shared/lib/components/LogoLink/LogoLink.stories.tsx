import type { Meta, StoryObj } from '@storybook/react';
import { LogoLink } from './LogoLink';

const meta = {
  title: 'shared/lib/components/LogoLink',
  component: LogoLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LogoLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
