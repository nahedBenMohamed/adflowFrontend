import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ListItemCommon, type ListItemCommonProps } from './ListItemCommon';

export const ListItemLink = styled(Link)<ListItemCommonProps>`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${ListItemCommon}
`;
