import { Tabs } from '@mantine/core';
import styled, { css } from 'styled-components';
import { HideScrollbarMixin } from '../../mixins';

// $stack sets flex-column layout on panel, it cannot be set always because it breaks tab behavior
export const FieldGroupTabPanel = styled(Tabs.Panel)<{ $stack?: boolean }>`
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;

  ${p =>
    p.$stack &&
    css`
      padding: 20px 24px;

      display: flex;
      flex-direction: column;
      gap: 20px;
    `}
`;

export const FieldGroupTabs = styled(Tabs)<{ $unstyled?: boolean }>`
  display: flex;
  flex-direction: column;

  .mantine-Tabs-tabsList {
    border: none;

    flex-wrap: nowrap;

    overflow-x: auto;

    ${HideScrollbarMixin};
  }

  ${p =>
    p.$unstyled
      ? css`
          .mantine-Tabs-tab {
            border: none;
            outline: none;
            margin: 0;

            padding: 4px 0 6px;
          }
        `
      : css`
          .mantine-Tabs-tab {
            border: none;
            outline: none;
            margin: 0;

            font-size: 14px;
            line-height: 20px;
            font-variant: tabular-nums;
            color: var(--button-text-graphite-primary-text);
            transition: var(--transition-200);

            padding: 8px 16px;

            &:hover {
              cursor: pointer;

              color: var(--button-text-green-hover);
            }

            &:active,
            &[aria-selected='true'] {
              color: var(--button-text-green-active);
            }
          }
        `}
`;
