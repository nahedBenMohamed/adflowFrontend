import type { Nullable } from '@/shared';

export class UpdateSiteFormConsentDto {
  isEnabled: boolean;
  text?: Nullable<string>;
  linkUrl?: Nullable<string>;
  linkText?: Nullable<string>;
  defaultValue?: boolean;

  constructor({ isEnabled, text, linkUrl, linkText, defaultValue }: UpdateSiteFormConsentDto) {
    this.isEnabled = isEnabled;
    this.text = text;
    this.linkUrl = linkUrl;
    this.linkText = linkText;
    this.defaultValue = defaultValue;
  }
}
