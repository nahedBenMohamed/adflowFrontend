import type { Meta, StoryObj } from '@storybook/react';
import { InputModel } from '../../models';
import { FunctionalTextEditor } from './FunctionalTextEditor';

const meta = {
  title: 'shared/lib/components/FunctionalTextEditor',
  component: FunctionalTextEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    model: InputModel.create(
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil iure distinctio illo rem expedita deserunt quam autem laborum temporibus molestiae, veritatis esse atque voluptatem in similique dolores odit obcaecati cum.'
    ),
  },
} satisfies Meta<typeof FunctionalTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    variant: 'filled',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};

export const WithFiles: Story = {
  args: {
    fileProps: {
      files: [],
      fileErrors: [],
      filesLoading: false,
      onFileDelete: () => {},
      onFileChange: () => {},
    },
  },
};

export const ShowHTML: Story = {
  args: {
    showHTMLProps: {
      show: true,
      minRows: 8,
      maxRows: 16,
    },
  },
};
