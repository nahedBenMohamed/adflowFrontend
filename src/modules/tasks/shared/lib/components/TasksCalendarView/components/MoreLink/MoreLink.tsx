import { generalSettingsStore } from '@/app';
import { TaskCalendarViewType } from '@/modules/tasks';
import { Language, truncateNumber } from '@/shared';
import type { MoreLinkContentArg } from '@fullcalendar/core';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Root = styled.div<{ $highlighted?: boolean }>`
  width: fit-content;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 1px 8px 2px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  ${p =>
    p.$highlighted &&
    css`
      background: color-mix(is rgba, var(--graphite-graphite-80) 60%, transparent);
      border: 1px solid var(--graphite-graphite-120);
    `};

  &:hover {
    background: var(--graphite-graphite-80);
  }

  &:active {
    background: var(--graphite-graphite-80);
  }
`;

const Text = styled.div`
  font-size: 12px;
  font-weight: 600;
  line-height: 17px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  content: MoreLinkContentArg;
}

const MoreLink = memo((props: Props) => {
  const { content } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'calendar',
  });

  // Remove title attribute from more links (Show 2 more events)
  useEffect(() => {
    const moreLinks = document.querySelectorAll('a.fc-daygrid-more-link.fc-more-link');

    moreLinks.forEach(ml => ml.removeAttribute('title'));
  }, []);

  const isLinkHighlighted = [TaskCalendarViewType.DAY, TaskCalendarViewType.WEEK].includes(
    content.view.type as TaskCalendarViewType
  );

  const isRussianLocale = generalSettingsStore.accountSettings?.language === Language.RUSSIAN;

  const contentNum = truncateNumber({ num: content.num, precision: 3 });

  return (
    <Root $highlighted={isLinkHighlighted}>
      <Text>{isRussianLocale ? `${t('more')} ${contentNum}` : `${contentNum} ${t('more')}`}</Text>
    </Root>
  );
});

MoreLink.displayName = 'MoreLink';
export { MoreLink };
