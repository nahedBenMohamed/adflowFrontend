import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../models';
import { AvatarCircle } from './AvatarCircle';

const mockAvatar = new Avatar({
  lastName: 'Doe',
  firstName: 'John',
  avatarUrl: 'https://picsum.photos/200',
});

const meta = {
  title: 'shared/lib/components/AvatarCircle',
  component: AvatarCircle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    avatar: mockAvatar,
  },
} satisfies Meta<typeof AvatarCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const XMedium: Story = {
  args: {
    avatar: mockAvatar,
    size: 'x-medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const XLarge: Story = {
  args: {
    size: 'x-large',
  },
};

export const XXLarge: Story = {
  args: {
    size: 'xx-large',
  },
};

export const XXXLarge: Story = {
  args: {
    size: 'xxx-large',
  },
};
