import { type Nullable } from '@/shared';

export interface ContactInfoDto {
  id: number;
  name: string;
  phone: Nullable<string[]>;
  email: Nullable<string>;
}
