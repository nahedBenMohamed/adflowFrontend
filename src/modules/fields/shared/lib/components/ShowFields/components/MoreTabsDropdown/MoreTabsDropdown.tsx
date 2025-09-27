import { FeedControlShowMoreIcon } from '@/modules/card';
import { MyDropdown, SelectOptionItem, SelectOptionsList } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { memo, useCallback } from 'react';
import styled, { css } from 'styled-components';

const Root = styled.button<{ $active: boolean }>`
  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  margin-left: 8px;
  background-color: var(--graphite-graphite-20);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--button-text-green-active);
      }
    `}
`;

export interface TabOption {
  id: number;
  name: string;
  active: boolean;
  onClick: () => void;
}

interface Props {
  options: TabOption[];
}

const MoreTabsDropdown = memo((props: Props) => {
  const { options } = props;

  const [opened, { open, close }] = useDisclosure(false);

  const getSelectHandler = useCallback(
    (option: TabOption) => () => {
      option.onClick();

      close();
    },
    [close]
  );

  return (
    <MyDropdown
      withinPortal
      opened={opened}
      position="bottom-start"
      Button={
        <Root $active={opened}>
          <FeedControlShowMoreIcon />
        </Root>
      }
      show={open}
      hide={close}
    >
      <SelectOptionsList padding="4px">
        {options.map(o => (
          <SelectOptionItem
            key={o.id}
            label={o.name}
            active={o.active}
            onSelect={getSelectHandler(o)}
            truncate
          />
        ))}
      </SelectOptionsList>
    </MyDropdown>
  );
});

MoreTabsDropdown.displayName = 'MoreTabsDropdown';
export { MoreTabsDropdown };
