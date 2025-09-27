import type { Optional } from '@/shared';
import { memo, type ReactNode } from 'react';
import styled, { css } from 'styled-components';

interface RootProps {
  $active?: boolean;
  $activeColor?: ActiveColor;
}

const Root = styled.button<RootProps>`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  color: var(--button-text-graphite-primary-text);

  padding: 4px 8px;
  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  svg {
    // .chat-rect - helper class in chat.svg icon to determine specific rect
    .chat-rect,
    path {
      transition: var(--transition-200);
    }
  }

  &:hover {
    cursor: pointer;

    ${p =>
      !p.$active &&
      css`
        color: var(--graphite-graphite-840);

        background-color: var(--graphite-graphite-40);

        svg {
          .chat-rect,
          path {
            fill: var(--graphite-graphite-840);
          }
        }
      `}
  }

  &:active {
    ${p =>
      !p.$active &&
      css`
        color: var(--button-text-graphite-priory-text);

        background-color: var(--graphite-graphite-80);

        svg {
          .chat-rect,
          path {
            fill: var(--button-text-graphite-priory-text);
          }
        }
      `}
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
  }

  ${p =>
    p.$active &&
    css`
      position: relative;

      color: var(--graphite-graphite-840);

      border-radius: none;

      svg {
        .chat-rect,
        path {
          fill: ${p.$activeColor === 'amethyst'
            ? 'var(--primary-statuses-amethyst-360)'
            : 'var(--primary-statuses-pink-360)'};
        }
      }

      &::after {
        content: '';

        position: absolute;
        left: 6px;
        bottom: -9px;

        height: 2px;
        width: calc(100% - 12px);

        z-index: 1;

        border-radius: 2px;
        background-color: ${p.$activeColor === 'amethyst'
          ? 'var(--primary-statuses-amethyst-360)'
          : 'var(--primary-statuses-pink-360)'};
      }
    `}
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

type ActiveColor = 'amethyst' | 'pink';

export enum ActualFeedTabs {
  NOTE = 'note',
  ACTIVITY = 'activity',
  TASK = 'task',
  CHAT = 'chat',
  DOCUMENTS = 'documents',
  VISIT = 'visit',
}

interface Props {
  text: string;
  Icon: ReactNode;
  tab: ActualFeedTabs;
  active?: boolean;

  disabled?: boolean;
  onClick: () => void;
}

export const FEED_CONTROL_DATA_TAB_ATTRIBUTE = 'data-tab';

const getActiveColor = (tab: ActualFeedTabs): Optional<ActiveColor> => {
  switch (tab) {
    case ActualFeedTabs.ACTIVITY:
      return 'pink';

    case ActualFeedTabs.NOTE:
      return 'amethyst';

    default:
      return;
  }
};

const FeedControlTab = memo((props: Props) => {
  const { text, Icon, tab, active, disabled, onClick } = props;

  const activeColor = getActiveColor(tab);

  return (
    <Root
      $active={active}
      disabled={disabled}
      $activeColor={activeColor}
      className="workspace__FeedControlTab--Root"
      {...{
        [FEED_CONTROL_DATA_TAB_ATTRIBUTE]: tab,
      }}
      onClick={onClick}
    >
      <IconWrapper>{Icon}</IconWrapper>

      {text}
    </Root>
  );
});

FeedControlTab.displayName = 'FeedControlTab';
export { FeedControlTab };
