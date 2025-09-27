import type { Nullable } from '@/shared';
import type { PbxProviderType } from '../../../shared';
import type { VoximplantSIPRegistrationDto } from './VoximplantSIPRegistrationDto';

export interface VoximplantSIPDto {
  id: number;
  name: string;
  externalId: number;
  type: PbxProviderType;
  userIds?: Nullable<number[]>;
  registration?: VoximplantSIPRegistrationDto;
}
