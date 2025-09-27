/* eslint-disable i18next/no-literal-string */

import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { PrimaryButton } from '../Buttons/PrimaryButton/PrimaryButton';
import { MyPopover } from './MyPopover';

const Root = styled.div`
  width: 200px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 16px;
`;

const meta = {
  title: 'shared/lib/components/MyPopover',
  component: MyPopover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withinPortal: true,
    opened: true,
    Target: (
      <div>
        <PrimaryButton variant="outlined">Popover</PrimaryButton>
      </div>
    ),
    children: (
      <Root>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia, iure aliquid? Deleniti
        maiores voluptatum voluptas! Odit neque similique tenetur, ipsa ipsum voluptates maiores,
        aliquid nulla dolore nostrum iure facilis! Perferendis nisi excepturi iste, similique
        placeat fugit amet earum velit accusamus?'
      </Root>
    ),
  },
} satisfies Meta<typeof MyPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
