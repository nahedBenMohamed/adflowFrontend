import type { Nullable } from '@/shared';
import type { SiteFormConsentDto } from '../../../../api';

export class SiteFormConsent {
  formId: number;
  isEnabled: boolean;
  text?: Nullable<string>;
  linkUrl?: Nullable<string>;
  linkText?: Nullable<string>;
  defaultValue?: boolean;

  constructor({ formId, isEnabled, text, linkUrl, linkText, defaultValue }: SiteFormConsent) {
    this.formId = formId;
    this.isEnabled = isEnabled;
    this.text = text;
    this.linkUrl = linkUrl;
    this.linkText = linkText;
    this.defaultValue = defaultValue;
  }

  static fromDto(dto: SiteFormConsentDto): SiteFormConsent {
    return new SiteFormConsent({
      formId: dto.formId,
      isEnabled: dto.isEnabled,
      text: dto.text,
      linkUrl: dto.linkUrl,
      linkText: dto.linkText,
      defaultValue: dto.defaultValue,
    });
  }
}
