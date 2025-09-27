import type { Meta, StoryObj } from '@storybook/react';
import { ColorUtil } from '../../utils/ColorUtil';
import { ColorPicker } from './ColorPicker';

const meta = {
  title: 'shared/lib/components/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    color: ColorUtil.getDefaultBgColor(),
    onChange: () => {},
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
