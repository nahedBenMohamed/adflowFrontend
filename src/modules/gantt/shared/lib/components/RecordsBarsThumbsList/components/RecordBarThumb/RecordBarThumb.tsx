import { getTaskStatusColor } from '@/modules/tasks';
import { NoSelectMixin, TruncateMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type MouseEventHandler } from 'react';
import styled from 'styled-components';
import { useGanttContext } from '../../../../../../context';
import type { Bar } from '../../../../models';

const Root = styled.div<{ $isRight: boolean }>`
  position: absolute;

  max-width: 200px;

  z-index: 2;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;

  font-size: 12px;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);

  overflow: hidden;
  padding-right: 16px;

  &:hover {
    cursor: pointer;
  }

  ${p => p.$isRight && `transform: translate(-100%)`};

  ${NoSelectMixin}
`;

const Title = styled.span`
  max-width: 176px;

  ${TruncateMixin};
`;

const Circle = styled.div<{ $leftPosition?: boolean }>`
  height: 10px;
  width: 10px;

  flex-shrink: 0;
  border-radius: 50%;
  background-color: var(--button-text-graphite-secondary-text);

  ${p => p.$leftPosition && `margin-left: 16px`};
`;

interface Props {
  bar: Bar;
}

type RecordBarThumbPosition = 'left' | 'right';

const RecordBarThumb = observer((props: Props) => {
  const { bar } = props;

  const { store } = useGanttContext();

  const { translateX: viewTranslateX, viewWidth } = store;
  const { translateX, translateY, record } = bar;

  const thumbPosition = useMemo<RecordBarThumbPosition>(() => {
    const rightSide = viewTranslateX + viewWidth;

    return translateX - rightSide > 0 ? 'right' : 'left';
  }, [translateX, viewTranslateX, viewWidth]);

  const left = useMemo<number>(
    () => (thumbPosition === 'right' ? viewTranslateX + viewWidth - 5 : viewTranslateX + 2),
    [thumbPosition, viewTranslateX, viewWidth]
  );

  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      e.stopPropagation();

      store.scrollToBar({ barInfo: bar, type: thumbPosition });
    },
    [bar, store, thumbPosition]
  );

  const { indicatorColor } = useMemo<{ indicatorColor: string }>(
    () =>
      record
        ? getTaskStatusColor(record.timeStatus)
        : { indicatorColor: 'var(--button-text-graphite-secondary-text)' },
    [record]
  );

  const isRight = thumbPosition === 'right';
  const isLeft = thumbPosition === 'left';

  return (
    <Root
      title={record.title}
      $isRight={isRight}
      style={{
        left: `${left}px`,
        top: `${translateY + 8}px`,
      }}
      onClick={handleClick}
    >
      {isLeft && <Circle $leftPosition style={{ backgroundColor: indicatorColor }} />}

      <Title>{record.title}</Title>

      {isRight && <Circle style={{ backgroundColor: indicatorColor }} />}
    </Root>
  );
});

RecordBarThumb.displayName = 'RecordBarThumb';
export { RecordBarThumb };
