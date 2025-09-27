import type { Meta, StoryObj } from '@storybook/react';
import { DownloadButton } from './DownloadButton';

const meta = {
  title: 'shared/lib/components/Buttons/DownloadButton',
  component: DownloadButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DownloadButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'small',
  },
};
