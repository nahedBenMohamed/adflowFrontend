import { activityTypeStore } from '@/modules/tasks';
import { convert } from 'html-to-text';
import { Activity, Task, type BaseTask } from '../models';

export const getTaskTitle = (task: BaseTask) => {
  if (task instanceof Task) {
    return task.title;
  } else if (task instanceof Activity) {
    const activityTypeTag = activityTypeStore.getById(task.activityTypeId).name;

    if (!task.text) return activityTypeTag;

    return `${activityTypeTag} — ${convert(task.text)}`;
  } else {
    throw new Error(
      `Unable to determine task title. Expected Task or Activity, given ${typeof task}`
    );
  }
};
