import { UtcDate, type EntityInfo, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { NotificationDto } from '../../../../api';
import type { NotificationType } from '../NotificationType/NotificationType';

export class Notification {
  id: number;
  userId: number;
  type: NotificationType;
  objectId: number;
  entityInfo: Nullable<EntityInfo>;
  fromUser: Nullable<number>;
  tagName: string;
  title: Nullable<string>;
  description: Nullable<string>;
  isSeen: boolean;
  startsIn: Nullable<number>;
  createdAt: UtcDate;

  constructor(
    id: number,
    userId: number,
    type: NotificationType,
    objectId: number,
    entityInfo: Nullable<EntityInfo>,
    fromUser: Nullable<number>,
    tagName: string,
    title: Nullable<string>,
    description: Nullable<string>,
    isSeen: boolean,
    startsIn: Nullable<number>,
    createdAt: UtcDate
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.objectId = objectId;
    this.entityInfo = entityInfo;
    this.fromUser = fromUser;
    this.tagName = tagName;
    this.title = title;
    this.description = description;
    this.isSeen = isSeen;
    this.startsIn = startsIn;
    this.createdAt = createdAt;

    makeAutoObservable(this);
  }

  static fromDto(dto: NotificationDto): Notification {
    return new Notification(
      dto.id,
      dto.userId,
      dto.type,
      dto.objectId,
      dto.entityInfo,
      dto.fromUser,
      dto.tagName,
      dto.title,
      dto.description,
      dto.isSeen,
      dto.startsIn,
      UtcDate.parseISO(dto.createdAt)
    );
  }

  static fromDtos(dtos: NotificationDto[]): Notification[] {
    return dtos.map(this.fromDto);
  }
}
