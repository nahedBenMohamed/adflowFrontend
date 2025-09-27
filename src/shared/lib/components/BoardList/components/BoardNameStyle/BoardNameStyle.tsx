import { css } from 'styled-components';
import { TruncateMixin } from '../../../../mixins';

export const BoardNameStyle = css`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 12px;
  font-weight: 600;
  text-align: left;
  line-height: 16px;
  text-decoration: none;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  ${TruncateMixin}
`;
