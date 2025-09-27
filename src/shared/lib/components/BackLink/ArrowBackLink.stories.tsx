import type { Meta, StoryObj } from '@storybook/react';
import { ArrowBackLink } from './ArrowBackLink';

const meta = {
  title: 'shared/lib/components/ArrowBackLink',
  component: ArrowBackLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ArrowBackLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    backLink: '/',
  },
};
