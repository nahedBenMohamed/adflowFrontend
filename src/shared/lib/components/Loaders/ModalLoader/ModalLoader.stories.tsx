import type { Meta, StoryObj } from '@storybook/react';
import { ModalLoader } from './ModalLoader';

const meta = {
  title: 'shared/lib/components/Loaders/ModalLoader',
  component: ModalLoader,
} satisfies Meta<typeof ModalLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
