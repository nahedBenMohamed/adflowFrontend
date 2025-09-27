import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useGanttContext } from '../../../../../../context';
import type { Bar } from '../../../../models';
import { GanttUtil } from '../../../../utils';

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
`;

const BarItem = styled.div`
  position: relative;
  top: -3px;
`;

interface Props {
  bar: Bar;
}

const HEIGHT = 8;

const RecordGroupBar = observer((props: Props) => {
  const { bar } = props;

  const { renderGroupBar } = useGanttContext();
  const { translateY } = bar;

  const { translateX, width } = GanttUtil.getMaxRange(bar);

  return (
    <Root
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
      }}
    >
      <BarItem>
        {renderGroupBar ? (
          renderGroupBar(bar, {
            width,
            height: HEIGHT,
          })
        ) : (
          <svg
            version="1.1"
            width={width + 1}
            height={HEIGHT + 8}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width + 1} ${HEIGHT + 8}`}
          >
            <path
              fill="#7B809E"
              d={`
              M${width - 2},0.5
              l-${width - 4},0
              c-0.41421,0 -0.78921,0.16789 -1.06066,0.43934
              c-0.27145,0.27145 -0.43934,0.64645 -0.43934,1.06066
              l0,13.65
              l6,-7
              l${width - 12},0
              l6,7
              l0,-13.65
              c-0.03256,-0.38255 -0.20896,-0.724 -0.47457,-0.97045
              c-0.26763,-0.24834 -0.62607,-0.40013 -1.01995,-0.40013z
            `}
            />
          </svg>
        )}
      </BarItem>
    </Root>
  );
});

RecordGroupBar.displayName = 'RecordGroupBar';
export { RecordGroupBar };
