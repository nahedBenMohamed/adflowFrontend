import { MyDropdown, SelectOptionItem, SelectOptionsList } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import styled, { css } from 'styled-components';
import { FeedControlShowMoreIcon } from '../../../../../../../assets';

const Root = styled.button<{ $active: boolean }>`
  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background-color: var(--primary-statuses-white-0);

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

export interface SimpleTabOption {
  title: string;
  onClick: () => void;
}

interface Props {
  options: SimpleTabOption[];
}

const MoreTabsDropdown = (props: Props) => {
  const { options } = props;

  const [opened, { open, close }] = useDisclosure(false);

  const handleSelect = (option: SimpleTabOption) => {
    option.onClick();

    close();
  };

  return (
    <MyDropdown
      withinPortal
      opened={opened}
      position="bottom-end"
      Button={
        <Root $active={opened}>
          <FeedControlShowMoreIcon />
        </Root>
      }
      show={open}
      hide={close}
    >
      <div>
        <SelectOptionsList>
          {options.map((o, idx) => (
            <SelectOptionItem
              key={`${o.title}-${idx}`}
              label={o.title}
              onSelect={() => handleSelect(o)}
            />
          ))}
        </SelectOptionsList>
      </div>
    </MyDropdown>
  );
};

MoreTabsDropdown.displayName = 'MoreTabsDropdown';
export { MoreTabsDropdown };
