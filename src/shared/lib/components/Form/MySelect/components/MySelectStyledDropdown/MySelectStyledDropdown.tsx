import { Menu } from '@mantine/core';
import styled from 'styled-components';

interface MySelectStyledDropdownProps {
  $width: number;
  $minWidth?: string;
  $maxWidth?: string;
}

export const MySelectStyledDropdown = styled(Menu.Dropdown)<MySelectStyledDropdownProps>`
  padding: 0 !important;

  width: ${p => p.$width}px !important;
  ${p => p.$minWidth && `min-width: ${p.$minWidth} !important`};
  ${p => p.$maxWidth && `max-width: ${p.$maxWidth} !important`};

  z-index: var(--dropdown-z-index);

  overflow: hidden;
  box-shadow: var(--dropdown-box-shadow);
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);
`;
