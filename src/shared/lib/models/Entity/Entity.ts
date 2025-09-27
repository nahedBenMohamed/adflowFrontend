import { entityTypeStore, type EntityDto } from '@/app';
import { FieldUtil, ParticipantsFieldValue, type PossibleFieldValue } from '@/modules/fields';
import { Chat } from '@/modules/multichat';
import type { Nullable, Optional } from '../../types';
import { FieldType } from '../Field/FieldType';
import type { UtcDateValue } from '../MyDatePicker/UtcDateValue';
import { UserRights } from '../Permission/UserRights';
import { UtcDate } from '../UtcDate';
import { EntityLink } from './EntityLink';
import type { ExternalEntity } from './ExternalEntity';

export class Entity {
  id: number;
  name: string;
  entityTypeId: number;
  responsibleUserId: number;
  stageId: Nullable<number>;
  boardId: Nullable<number>;
  fieldValues: PossibleFieldValue[];
  entityLinks: EntityLink[];
  externalEntities: ExternalEntity[];
  createdAt: UtcDate;
  isNew?: boolean;
  userRights: UserRights;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;
  lastShipmentDate?: UtcDateValue;
  closedAt?: UtcDateValue;
  chats?: Chat[];
  focused?: boolean;

  constructor({
    id,
    name,
    entityTypeId,
    responsibleUserId,
    stageId,
    boardId,
    fieldValues,
    entityLinks,
    externalEntities,
    createdAt,
    isNew,
    userRights,
    copiedFrom,
    copiedCount,
    lastShipmentDate,
    closedAt,
    chats,
    focused,
  }: {
    id: number;
    name: string;
    entityTypeId: number;
    responsibleUserId: number;
    stageId: Nullable<number>;
    boardId: Nullable<number>;
    fieldValues: PossibleFieldValue[];
    entityLinks: EntityLink[];
    externalEntities: ExternalEntity[];
    createdAt: UtcDate;
    isNew: boolean;
    userRights: UserRights;
    copiedFrom: Nullable<number>;
    copiedCount: Nullable<number>;
    lastShipmentDate?: UtcDateValue;
    closedAt?: UtcDateValue;
    chats?: Chat[];
    focused?: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.entityTypeId = entityTypeId;
    this.responsibleUserId = responsibleUserId;
    this.boardId = boardId;
    this.stageId = stageId;
    this.fieldValues = fieldValues;
    this.entityLinks = entityLinks;
    this.externalEntities = externalEntities;
    this.createdAt = createdAt;
    this.isNew = isNew;
    this.userRights = userRights;
    this.copiedFrom = copiedFrom;
    this.copiedCount = copiedCount;
    this.lastShipmentDate = lastShipmentDate;
    this.closedAt = closedAt;
    this.chats = chats;
    this.focused = focused;
  }

  static createEmpty({
    entityId,
    name,
    entityTypeId,
    userId,
    stageId,
    boardId,
  }: {
    entityId: number;
    name: string;
    entityTypeId: number;
    userId: number;
    stageId?: Nullable<number>;
    boardId?: Nullable<number>;
  }): Entity {
    return new Entity({
      name,
      isNew: true,
      id: entityId,
      entityTypeId,
      fieldValues: [],
      entityLinks: [],
      copiedFrom: null,
      copiedCount: null,
      externalEntities: [],
      boardId: boardId ?? null,
      stageId: stageId ?? null,
      createdAt: UtcDate.now(),
      responsibleUserId: userId,
      userRights: new UserRights(true, true, true),
    });
  }

  static createEmptyProject({
    entityId,
    name,
    entityTypeId,
    userId,
    stageId,
    boardId,
  }: {
    entityId: number;
    name: string;
    entityTypeId: number;
    userId: number;
    stageId?: Nullable<number>;
    boardId: Nullable<number>;
  }): Entity {
    const entityType = entityTypeStore.getById(entityTypeId);

    const participantsField = entityType.fields.find(f => f.type === FieldType.PARTICIPANTS);

    if (!participantsField)
      throw new Error(`Failed to create empty project, participantsField is not defined`);

    return new Entity({
      id: entityId,
      name,
      boardId,
      isNew: true,
      entityTypeId,
      entityLinks: [],
      copiedFrom: null,
      copiedCount: null,
      externalEntities: [],
      stageId: stageId ?? null,
      createdAt: UtcDate.now(),
      responsibleUserId: userId,
      userRights: new UserRights(true, true, true),
      fieldValues: [ParticipantsFieldValue.create({ field: participantsField, userIds: [userId] })],
    });
  }

  static fromDto(dto: EntityDto): Entity {
    const fieldValues = FieldUtil.fromDtos(dto.fieldValues);
    const entityLinks = EntityLink.fromDtos(dto.entityLinks);

    return new Entity({
      id: dto.id,
      fieldValues,
      entityLinks,
      isNew: false,
      name: dto.name,
      stageId: dto.stageId,
      boardId: dto.boardId,
      focused: dto.focused,
      userRights: dto.userRights,
      copiedFrom: dto.copiedFrom,
      entityTypeId: dto.entityTypeId,
      copiedCount: dto.copiedCount,
      externalEntities: dto.externalEntities,
      responsibleUserId: dto.responsibleUserId,
      createdAt: UtcDate.parseISO(dto.createdAt),
      closedAt: UtcDate.parseISONullable(dto.closedAt),
      lastShipmentDate: UtcDate.parseISONullable(dto.lastShipmentDate),
      chats: dto.chats ? Chat.fromDtos(dto.chats) : undefined,
    });
  }

  static fromNullableDto(dto: Nullable<EntityDto>): Nullable<Entity> {
    if (!dto) return null;

    return this.fromDto(dto);
  }

  static fromDtos(dtos: EntityDto[]): Entity[] {
    return dtos.map(this.fromDto);
  }

  changeStageId = (stageId: Nullable<number>): void => {
    this.stageId = stageId;
  };

  findLinkByTargetId = (targetId: number): Optional<EntityLink> => {
    return this.entityLinks.find(el => el.targetId === targetId);
  };

  addEntityLink = (entityLink: EntityLink): void => {
    this.entityLinks = [...this.entityLinks, entityLink];
  };
}
