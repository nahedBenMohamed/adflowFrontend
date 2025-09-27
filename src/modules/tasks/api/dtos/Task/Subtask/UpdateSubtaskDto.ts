import type { Subtask } from '../../../../shared';

export class UpdateSubtaskDto {
  id: number;
  text: string;
  resolved: boolean;
  sortOrder: number;

  constructor({ id, text, resolved, sortOrder }: UpdateSubtaskDto) {
    this.id = id;
    this.text = text;
    this.resolved = resolved;
    this.sortOrder = sortOrder;
  }

  static fromSubtask(subtask: Subtask): UpdateSubtaskDto {
    return new UpdateSubtaskDto({
      id: subtask.id,
      text: subtask.text,
      resolved: subtask.resolved,
      sortOrder: subtask.sortOrder,
    });
  }
}
