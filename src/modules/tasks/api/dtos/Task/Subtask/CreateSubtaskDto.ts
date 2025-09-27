import type { Subtask } from '../../../../shared';

export class CreateSubtaskDto {
  text: string;
  resolved: boolean;
  sortOrder: number;

  constructor({ text, resolved, sortOrder }: CreateSubtaskDto) {
    this.text = text;
    this.resolved = resolved;
    this.sortOrder = sortOrder;
  }

  static fromSubtask(subtask: Subtask): CreateSubtaskDto {
    return new CreateSubtaskDto({
      text: subtask.text,
      resolved: subtask.resolved,
      sortOrder: subtask.sortOrder,
    });
  }
}
