import styled from 'styled-components';
import { TruncateMixin } from '../../../mixins';

export const ListItemText = styled.span`
  display: inline-block;

  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  word-break: normal;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;
