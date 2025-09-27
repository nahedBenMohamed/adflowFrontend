import { TaskTimeStatus } from '@/shared';
import type { ReactNode } from 'react';
import { TaskGreenIcon, TaskGreyDarkIcon, TaskGreyLightIcon, TaskRedIcon } from '../../assets';

export const TaskTimeStatusIcons = new Map<TaskTimeStatus, ReactNode>([
  [TaskTimeStatus.RESOLVED, <TaskGreyLightIcon />],
  [TaskTimeStatus.EXPIRED, <TaskRedIcon />],
  [TaskTimeStatus.ACTIVE_TODAY, <TaskGreenIcon />],
  [TaskTimeStatus.ACTIVE_FUTURE, <TaskGreyDarkIcon />],
]);
