import type { Meta, StoryObj } from '@storybook/react';
import { WarningModal } from './WarningModal';

const meta = {
  title: 'shared/lib/components/Modals/WarningModal',
  component: WarningModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    isOpened: true,
    title: 'Some warning',
    annotation: 'Lorem ipsum dolor sit amet.',
    onClose: () => {},
  },
} satisfies Meta<typeof WarningModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Warning: Story = {
  args: {
    icon: 'warning',
  },
};
