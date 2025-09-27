import { observer } from 'mobx-react-lite';
import { useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGanttContext } from '../../../../../context';

interface RootProps {
  $left: CSSProperties['left'];
  $right: CSSProperties['right'];
  $display: CSSProperties['display'];
  $scrolling: boolean;
}

const Root = styled.button<RootProps>`
  position: absolute;
  top: 0;
  left: ${p => (typeof p.$left === 'number' ? `${p.$left}px` : p.$left)};
  right: ${p => (typeof p.$right === 'number' ? `${p.$right}px` : p.$right)};

  z-index: 10;

  display: ${p => p.$display};

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--primary-statuses-white-0);

  padding: 0 8px;
  transform: translate(12px, 14px);
  border-radius: var(--border-radius-element);
  background-color: var(--primary-statuses-green-520);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
  transition: var(--transition-200);

  ${p => p.$scrolling && `opacity: 0;`}

  &:hover {
    cursor: pointer;
  }
`;

const TimeAxisTodayIndicator = observer(() => {
  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_timeline',
  });

  const { store } = useGanttContext();
  const { scrolling, translateX, tableWidth, viewWidth, todayTranslateX, scrollToToday } = store;

  const type = todayTranslateX < translateX ? 'left' : 'right';
  const left = type === 'left' ? tableWidth : 'unset';
  const right = type === 'right' ? 111 : 'unset';

  const display = useMemo<CSSProperties['display']>(() => {
    const isOverLeft = todayTranslateX < translateX;
    const isOverRight = todayTranslateX > translateX + viewWidth;

    return isOverLeft || isOverRight ? 'block' : 'none';
  }, [todayTranslateX, translateX, viewWidth]);

  return (
    <Root
      type="button"
      $left={left}
      $right={right}
      $display={display}
      $scrolling={scrolling}
      onClick={scrollToToday}
    >
      {t('today')}
    </Root>
  );
});

TimeAxisTodayIndicator.displayName = 'TimeAxisTodayIndicator';
export { TimeAxisTodayIndicator };
