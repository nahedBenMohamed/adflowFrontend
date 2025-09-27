import type { FieldValueDto } from '@/modules/fields';
import type { Nullable, UserRights } from '@/shared';

export interface EntityListItemDto {
  id: number;
  name: string;
  responsibleUserId: number;
  entityTypeId: number;
  createdAt: string;
  fieldValues: FieldValueDto<unknown>[];
  userRights: UserRights;
  stageId: Nullable<number>;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;
  focused?: boolean;
}
