import styled from 'styled-components';
import { ListItemCommon } from './ListItemCommon';

interface ListItemProps {
  $relative?: boolean;
  $active?: boolean;
  $padding?: string;
  $justify?: string;
}

export const DropdownListItem = styled.li<ListItemProps>`
  ${p => p.$relative && `position: relative`};

  ${ListItemCommon}
`;
