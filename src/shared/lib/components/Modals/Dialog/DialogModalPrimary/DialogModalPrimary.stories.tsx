/* eslint-disable i18next/no-literal-string */

import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { DialogModalPrimary } from './DialogModalPrimary';

const Root = styled.div`
  padding: 16px;
`;

const meta = {
  title: 'shared/lib/components/Modals/Dialog/DialogModalPrimary',
  component: DialogModalPrimary,
  args: {
    isOpened: true,
    width: '400px',
    maxHeight: '440px',
    children: (
      <Root>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea dolore modi exercitationem
        consectetur deleniti optio at reiciendis! Impedit perspiciatis earum velit quo iusto magnam
        consequatur id voluptate dolorem, accusamus ex sequi nesciunt voluptatem ab, quam quia
        doloribus officia aut ipsam!'
      </Root>
    ),
    onClose: () => {},
  },
} satisfies Meta<typeof DialogModalPrimary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
