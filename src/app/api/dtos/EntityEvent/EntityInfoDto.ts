import { type Nullable } from '@/shared';
import { type ContactInfoDto } from './ContactInfoDto';

export interface EntityInfoDto {
  id: number;
  name: string;
  entityTypeId: number;
  hasAccess: boolean;
  contact: Nullable<ContactInfoDto>;
}
