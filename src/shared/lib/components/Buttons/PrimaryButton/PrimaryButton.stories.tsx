import type { Meta, StoryObj } from '@storybook/react';
import { PrimaryButton } from './PrimaryButton';

const meta = {
  title: 'shared/lib/components/Buttons/PrimaryButton',
  component: PrimaryButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'filled',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};

export const LinkOutlined: Story = {
  args: {
    variant: 'link-outlined',
  },
};

export const Empty: Story = {
  args: {
    variant: 'empty',
  },
};

export const EmptyDanger: Story = {
  args: {
    variant: 'empty-danger',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    linkProps: {
      to: '/',
    },
  },
};
