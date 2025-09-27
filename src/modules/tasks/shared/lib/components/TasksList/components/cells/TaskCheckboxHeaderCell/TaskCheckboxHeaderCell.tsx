import { iconStore } from '@/app';
import { IconName } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const Root = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 2px;

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: ${p => p.$color};
  }
`;

const TaskCheckboxHeaderCell = observer(() => {
  return (
    <Root $color={iconStore.systemModuleColor}>{iconStore.getByName(IconName.TICK_1).icon}</Root>
  );
});

TaskCheckboxHeaderCell.displayName = 'TaskCheckboxHeaderCell';
export { TaskCheckboxHeaderCell };
