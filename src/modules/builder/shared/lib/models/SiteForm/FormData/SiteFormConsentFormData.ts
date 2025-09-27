import { BooleanModel, InputModel, validateForm } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { CreateSiteFormConsentDto, UpdateSiteFormConsentDto } from '../../../../../api';
import type { SiteFormConsent } from '../SiteFormConsent';

export class SiteFormConsentFormData {
  isEnabled: BooleanModel;
  text: InputModel;
  linkUrl: InputModel;
  linkText: InputModel;
  defaultValue: BooleanModel;

  private constructor({
    isEnabled,
    defaultValue,
    text,
    linkUrl,
    linkText,
  }: {
    isEnabled: boolean;
    defaultValue: boolean;
    text?: string;
    linkUrl?: string;
    linkText?: string;
  }) {
    this.isEnabled = BooleanModel.create(isEnabled);
    this.text = InputModel.create(text).required();
    this.linkUrl = InputModel.create(linkUrl);
    this.linkText = InputModel.create(linkText);
    this.defaultValue = BooleanModel.create(defaultValue);

    makeAutoObservable(this);
  }

  static empty({
    defaultText,
    defaultLinkText,
  }: {
    defaultText: string;
    defaultLinkText: string;
  }): SiteFormConsentFormData {
    return new SiteFormConsentFormData({
      isEnabled: true,
      text: defaultText,
      defaultValue: true,
      linkText: defaultLinkText,
      linkUrl: 'https://wikipedia.org/wiki/Privacy_policy',
    });
  }

  static fromModel(siteFormConsent: SiteFormConsent): SiteFormConsentFormData {
    return new SiteFormConsentFormData({
      isEnabled: siteFormConsent.isEnabled,
      text: siteFormConsent.text ?? '',
      linkUrl: siteFormConsent.linkUrl ?? '',
      linkText: siteFormConsent.linkText ?? '',
      defaultValue: siteFormConsent.defaultValue ?? true,
    });
  }

  get createFormConsentDto(): CreateSiteFormConsentDto {
    return new CreateSiteFormConsentDto({
      isEnabled: this.isEnabled.value,
      text: this.text.trimmedValue,
      linkUrl: this.linkUrl.trimmedValue,
      linkText: this.linkText.trimmedValue,
      defaultValue: this.defaultValue.value,
    });
  }

  get updateFormConsentDto(): UpdateSiteFormConsentDto {
    return new UpdateSiteFormConsentDto({
      isEnabled: this.isEnabled.value,
      text: this.text.trimmedValue,
      linkUrl: this.linkUrl.trimmedValue,
      linkText: this.linkText.trimmedValue,
      defaultValue: this.defaultValue.value,
    });
  }

  validate = (): boolean => {
    if (this.isEnabled.value) return validateForm(this);

    return true;
  };
}
