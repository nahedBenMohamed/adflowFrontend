import type { EntityInfo, Nullable } from '@/shared';
import type { NotificationType } from '../../shared';

export class NotificationDto {
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
  createdAt: string;

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
    createdAt: string
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
  }
}
