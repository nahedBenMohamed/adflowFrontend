import { css } from 'styled-components';
import { TruncateMixin } from '../../../mixins';

export interface ListItemCommonProps {
  $active?: boolean;
  $padding?: string;
  $justify?: string;
  $disabled?: boolean;
}

export const ListItemCommon = css<ListItemCommonProps>`
  width: 100%;

  display: inline-flex;
  align-items: center;
  justify-content: ${p => (p.$justify ? p.$justify : 'space-between')};
  flex-shrink: 0;
  gap: 8px;

  font-size: 14px;
  line-break: none;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  padding: ${p => (p.$padding ? p.$padding : '6px 16px')};

  &:hover {
    cursor: pointer;

    color: var(--button-text-graphite-priory-text);

    background: ${p => (p.$active ? '#e6fbda' : '#f3fded')};
  }

  &:active {
    background: #e6fbda;
  }

  ${p => p.$active && `background: #e6fbda`};

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.65;
    `}

  ${TruncateMixin}
`;
