import { type StoryObj } from '@storybook/react';
import { OutlinedSearchInput } from './OutlinedSearchInput';

const meta = {
  title: 'shared/lib/components/Form/OutlinedSearchInput',
  component: OutlinedSearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    value: '',
    placeholder: 'placeholder...',
    handleChange: () => {},
  },
  decorators: [
    (Story: React.FC) => (
      <div style={{ display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
