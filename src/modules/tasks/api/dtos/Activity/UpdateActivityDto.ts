import type { ManualSorting, Nullable } from '@/shared';
import type { Activity } from '../../../shared';

export class UpdateActivityDto {
  activityTypeId?: number;
  entityId?: number;
  result?: Nullable<string>;
  responsibleUserId?: number;
  startDate?: Nullable<string>;
  endDate?: Nullable<string>;
  text?: string;
  isResolved?: boolean;
  fileIds?: string[];
  sorting?: ManualSorting;

  private constructor(data: Partial<UpdateActivityDto>) {
    Object.assign(this, data);
  }

  static create(data: Partial<UpdateActivityDto>): UpdateActivityDto {
    return new UpdateActivityDto(data);
  }

  static fromActivity(model: Activity): UpdateActivityDto {
    return this.create({
      text: model.text,
      result: model.result,
      isResolved: model.isResolved,
      entityId: model.entityInfo!.id,
      activityTypeId: model.activityTypeId,
      responsibleUserId: model.responsibleUserId,
      endDate: model.endDate ? model.endDate.formatISO() : null,
      fileIds: model.fileLinks.map<string>(fl => fl.fileInfo.fileId),
      startDate: model.startDate ? model.startDate.formatISO() : null,
    });
  }
}
