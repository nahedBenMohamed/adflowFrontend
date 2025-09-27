/* eslint-disable i18next/no-literal-string */

import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { PrimaryButton } from '../Buttons/PrimaryButton/PrimaryButton';
import { MyDrawer } from './MyDrawer';

const Root = styled.div`
  padding: 16px;
`;

const meta = {
  title: 'shared/lib/components/MyDrawer',
  component: MyDrawer,
  args: {
    opened: true,
    buttonRef: null as any,
    Header: <b>Lorem ipsum dolor sit amet consectetur adipisicing elit.</b>,
    Controls: <PrimaryButton>Save</PrimaryButton>,
    children: (
      <Root>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium odit, vel placeat
        architecto perferendis quam eum sunt commodi perspiciatis excepturi dolorum minima laborum
        veritatis sequi beatae magni? Laborum, consequatur eum.
      </Root>
    ),
    hide: () => {},
  },
} satisfies Meta<typeof MyDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
