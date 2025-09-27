import { FieldUtil, SimpleFieldValueDto } from '@/modules/fields';
import type { Entity, Nullable } from '@/shared';

export class CreateSimpleEntityDto {
  entityTypeId: number;
  name?: string;
  boardId?: number;
  ownerId?: number;
  stageId?: number;
  focused?: boolean;
  fieldValues?: Nullable<SimpleFieldValueDto[]>;
  linkedEntities?: Nullable<CreateSimpleEntityDto[]> | number[];

  constructor({
    name,
    boardId,
    ownerId,
    stageId,
    focused,
    entityTypeId,
    fieldValues,
    linkedEntities,
  }: CreateSimpleEntityDto) {
    this.name = name;
    this.boardId = boardId;
    this.ownerId = ownerId;
    this.stageId = stageId;
    this.focused = focused;
    this.entityTypeId = entityTypeId;
    this.fieldValues = fieldValues;
    this.linkedEntities = linkedEntities;
  }

  static fromEntity(entity: Entity, linkedEntityIds?: number[]): CreateSimpleEntityDto {
    return new CreateSimpleEntityDto({
      entityTypeId: entity.entityTypeId,
      name: entity.name,
      focused: entity.focused,
      ownerId: entity.responsibleUserId,
      boardId: entity.boardId ?? undefined,
      stageId: entity.stageId ?? undefined,
      fieldValues: FieldUtil.toDtos(entity.fieldValues) ?? undefined,
      linkedEntities: linkedEntityIds,
    });
  }
}
