import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import styled from 'styled-components';
import { useGanttContext } from '../../../../../context';

interface RootProps {
  $height: number;
  $translateX: number;
}

const Root = styled.div<RootProps>`
  position: absolute;
  top: 0;

  width: 1px;
  height: ${p => p.$height}px;

  transform: translateX(${p => p.$translateX}px);
  // --primary-statuses-green-520 with 60% opacity
  background-color: rgba(104, 210, 34, 0.6);

  &:hover {
    pointer-events: none;
  }
`;

const TimeAxisTodayLine = observer(() => {
  const {
    store: {
      todayTranslateX,
      bodyScrollHeight,
      viewConfig: { view: type },
    },
  } = useGanttContext();

  // to center the line in relation to the minor axis label
  const centerOffset = useMemo(() => {
    switch (type) {
      case 'fifteen-minutes':
        return 20;

      case 'hour':
        return 15;

      case 'day':
        return 20;

      default:
        return 15;
    }
  }, [type]);

  return <Root $height={bodyScrollHeight} $translateX={todayTranslateX + centerOffset} />;
});

TimeAxisTodayLine.displayName = 'TimeAxisTodayLine';
export { TimeAxisTodayLine };
