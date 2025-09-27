import type { EntityLinkDto } from '@/app';
import type { FieldValueDto } from '@/modules/fields';
import type { ChatDto } from '@/modules/multichat';
import type { ExternalEntity, Nullable, UserRights } from '@/shared';

export interface EntityDto {
  id: number;
  name: string;
  createdBy: number;
  createdAt: string;
  entityTypeId: number;
  userRights: UserRights;
  boardId: Nullable<number>;
  responsibleUserId: number;
  stageId: Nullable<number>;
  entityLinks: EntityLinkDto[];
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;
  externalEntities: ExternalEntity[];
  fieldValues: FieldValueDto<unknown>[];
  lastShipmentDate?: string;
  closedAt?: string;
  chats?: ChatDto[];
  focused?: boolean;
}
