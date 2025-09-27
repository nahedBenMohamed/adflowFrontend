import type { Meta, StoryObj } from '@storybook/react';
import { WholePageLoaderWithLogo } from './WholePageLoaderWithLogo';

const meta = {
  title: 'shared/lib/components/Loaders/WholePageLoaderWithLogo',
  component: WholePageLoaderWithLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WholePageLoaderWithLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
