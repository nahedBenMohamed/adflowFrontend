import type { Nullable } from '@/shared';

export interface SiteFormGratitudeDto {
  formId: number;
  isEnabled: boolean;
  header?: Nullable<string>;
  text?: Nullable<string>;
}
