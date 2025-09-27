import { MyTooltip } from '@/shared';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Bullet = styled.div<{ $bgColor: string }>`
  width: 9px;
  height: 9px;

  border-radius: 50%;
  background-color: ${p => p.$bgColor};
`;

const Count = styled.span<{ $color: string }>`
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  color: ${p => p.$color};
`;

interface Props {
  color: string;
  count: number;
  title: string;
}

const TaskIndicator = (props: Props) => {
  const { color, count, title } = props;

  return (
    <MyTooltip label={title} position="bottom" withinPortal>
      <Root>
        <Bullet $bgColor={color} />
        <Count $color={color}>{count}</Count>
      </Root>
    </MyTooltip>
  );
};

export { TaskIndicator };
