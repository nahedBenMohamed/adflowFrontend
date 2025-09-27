import { TruncateMixin } from '@/shared';
import styled from 'styled-components';
import { TaskIndicatorColor, type TaskIndicator } from '../../../../models';

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HeaderTopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const HeaderBottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CardDate = styled.span<{ $gray: boolean }>`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${p =>
    p.$gray
      ? 'var(--button-text-graphite-secondary-text)'
      : 'var(--button-text-graphite-priory-text)'};
`;

export const LinkedEntitiesWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--button-text-graphite-primary-text);
  }
`;

export const LinkedEntitiesDelimiter = styled.span`
  width: 1px;
  height: 14px;

  background-color: var(--button-text-graphite-primary-text);
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

interface TaskStatusWrapperProps {
  $gray: boolean;
  $indicatorColor: TaskIndicator;
}

export const TaskStatusWrapper = styled.div<TaskStatusWrapperProps>`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: ${p =>
    p.$gray ? 'var(--button-text-graphite-primary-text)' : TaskIndicatorColor[p.$indicatorColor]};
`;

interface StatusCircleProps {
  $gray: boolean;
  $indicatorColor: TaskIndicator;
}

export const StatusCircle = styled.div<StatusCircleProps>`
  width: 9px;
  height: 9px;

  flex-shrink: 0;

  border-radius: 50%;
  background-color: ${p =>
    p.$gray ? 'var(--button-text-graphite-primary-text)' : TaskIndicatorColor[p.$indicatorColor]};
`;

export const Value = styled.span<{ $gray: boolean }>`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${p =>
    p.$gray
      ? 'var(--button-text-graphite-secondary-text)'
      : 'var(--button-text-graphite-priory-text)'};
  transition: var(--transition-200);

  ${TruncateMixin}
`;
