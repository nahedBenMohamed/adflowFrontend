import styled, { css, type CSSProperties } from 'styled-components';

export interface BaseTableBodyRowProps {
  $filled?: boolean;
  $active?: boolean;
  $striped?: boolean;
  $focused?: boolean;
  $selectable?: boolean;
  $paddingLeft?: CSSProperties['paddingLeft'];
  $paddingRight?: CSSProperties['paddingRight'];
}

export const BaseTableBodyRow = styled.div<BaseTableBodyRowProps>`
  height: 32px;
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  padding: 4px 12px;
  margin-bottom: 8px;
  border: 1px solid transparent;

  ${p =>
    p.$filled &&
    css`
      height: 42px;

      padding: 8px 12px;
      background-color: var(--primary-statuses-white-0);
      border-radius: var(--border-radius-element);
      box-shadow:
        0px 1px 2px 0px #d0daeb,
        0px 0px 2px 0px #eef4fe;
    `}

  ${p =>
    p.$selectable &&
    css`
      &:hover {
        cursor: pointer;

        background-color: ${p.$active
          ? 'var(--graphite-graphite-40)'
          : 'var(--graphite-graphite-20)'};
      }

      ${p.$active && `background-color: var(--graphite-graphite-40)`};
    `}

  ${p =>
    p.$striped &&
    css`
      &:nth-child(odd) {
        background-color: var(--graphite-graphite-20);
      }
    `}

  ${p =>
    p.$focused &&
    css`
      border: 1px solid var(--primary-statuses-green-520);
      box-shadow:
        0px 1px 2px 0px var(--primary-statuses-green-520),
        0px 0px 2px 0px var(--button-text-green-hover);
    `}

  padding-left: ${p => p.$paddingLeft};
  padding-right: ${p => p.$paddingRight};
`;
