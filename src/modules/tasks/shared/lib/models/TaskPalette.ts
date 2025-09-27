import { TaskTimeStatus } from '@/shared';
import type { TaskColorStyle } from './TaskColorStyles';
import { TaskHexColors } from './TaskHexColors';

export const TaskPalette: Record<TaskTimeStatus, TaskColorStyle> = {
  [TaskTimeStatus.EXPIRED]: {
    titleColor: TaskHexColors.RED,
    textColor: TaskHexColors.WHITE,
    bgColor: TaskHexColors.RED,
  },
  [TaskTimeStatus.RESOLVED]: {
    titleColor: TaskHexColors.BLUE,
    textColor: TaskHexColors.WHITE,
    bgColor: TaskHexColors.BLUE,
  },
  [TaskTimeStatus.ACTIVE_TODAY]: {
    titleColor: TaskHexColors.GREEN,
    textColor: TaskHexColors.WHITE,
    bgColor: TaskHexColors.GREEN,
  },
  [TaskTimeStatus.ACTIVE_FUTURE]: {
    titleColor: TaskHexColors.BLUE,
    textColor: TaskHexColors.BLUE,
    bgColor: 'transparent',
  },
};
