import { Menu, type MenuProps } from '@mantine/core';
import type { CSSProperties, KeyboardEventHandler, ReactNode } from 'react';
import styled from 'styled-components';

const StyledDropdown = styled(Menu.Dropdown)<{ $minWidth?: CSSProperties['minWidth'] }>`
  ${p => p.$minWidth && `min-width: ${p.$minWidth} !important`};

  padding: 0;
  border: none;
  overflow: hidden;
  box-shadow: var(--dropdown-box-shadow);
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);
`;

type OmittedMenuProps = Omit<MenuProps, 'opened' | 'onOpen' | 'onClose'>;

export interface MyDropdownProps extends OmittedMenuProps {
  opened: boolean;
  children: ReactNode;
  Button?: ReactNode;
  dropdownMinWidth?: CSSProperties['minWidth'];
  show: () => void;
  hide: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
}

const MyDropdown = (props: MyDropdownProps) => {
  const { Button, opened, children, dropdownMinWidth, show, hide, onKeyDown, ...rest } = props;

  return (
    <Menu {...rest} zIndex="var(--dropdown-z-index)" opened={opened} onOpen={show} onClose={hide}>
      {Button && <Menu.Target>{Button}</Menu.Target>}

      <StyledDropdown
        $minWidth={dropdownMinWidth}
        className="workspace__MyDropdown--StyledDropdown"
        onKeyDown={onKeyDown}
      >
        {children}
      </StyledDropdown>
    </Menu>
  );
};

export { MyDropdown };
