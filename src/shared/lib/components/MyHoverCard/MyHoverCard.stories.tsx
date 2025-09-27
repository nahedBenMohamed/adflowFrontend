/* eslint-disable i18next/no-literal-string */

import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { MyHoverCard } from './MyHoverCard';

const Target = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  &:hover {
    cursor: pointer;
  }
`;

const Root = styled.div`
  width: 200px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 16px;
`;

const meta = {
  title: 'shared/lib/components/MyHoverCard',
  component: MyHoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withinPortal: true,
    target: <Target>Hover me</Target>,
    children: (
      <Root>
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis autem molestias repudiandae,
        quas ex commodi hic accusamus, architecto nostrum ut distinctio! Quibusdam officiis
        distinctio, aliquam accusamus nemo, cum quos odio esse nihil eum illum numquam in excepturi
        quia commodi consectetur.'
      </Root>
    ),
  },
} satisfies Meta<typeof MyHoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
