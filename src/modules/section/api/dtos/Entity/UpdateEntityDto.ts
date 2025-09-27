import type { EntityLinkDto } from '@/app';
import { FieldUtil, type FieldValueDto } from '@/modules/fields';
import { EntityLink, type Entity, type ManualSorting } from '@/shared';

export class UpdateEntityDto {
  name: string;
  responsibleUserId: number;
  fieldValues: FieldValueDto<unknown>[];
  entityLinks: EntityLinkDto[];
  stageId?: number;
  sorting?: ManualSorting;
  focused?: boolean;

  private constructor(data: Partial<UpdateEntityDto>) {
    Object.assign(this, data);
  }

  static create(data: Partial<UpdateEntityDto>): UpdateEntityDto {
    return new UpdateEntityDto(data);
  }

  static fromModel(model: Entity): UpdateEntityDto {
    return new UpdateEntityDto({
      name: model.name,
      responsibleUserId: model.responsibleUserId,
      fieldValues: FieldUtil.toDtos(model.fieldValues),
      entityLinks: EntityLink.toDtos(model.entityLinks),
      stageId: model.stageId ? model.stageId : undefined,
      focused: model.focused,
    });
  }
}
