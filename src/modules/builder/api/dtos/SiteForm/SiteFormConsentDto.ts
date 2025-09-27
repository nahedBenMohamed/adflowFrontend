import type { Nullable } from '@/shared';

export interface SiteFormConsentDto {
  formId: number;
  isEnabled: boolean;
  text?: Nullable<string>;
  linkUrl?: Nullable<string>;
  linkText?: Nullable<string>;
  defaultValue?: boolean;
}
