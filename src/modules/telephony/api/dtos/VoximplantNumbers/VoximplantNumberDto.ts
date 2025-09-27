import type { Nullable } from '@/shared';

export interface VoximplantNumberDto {
  id: number;
  phoneNumber: string;
  externalId: string;
  userIds?: Nullable<number[]>;
}
