import { CreateSiteFormGratitudeDto, UpdateSiteFormGratitudeDto } from '@/modules/builder/api';
import { BooleanModel, InputModel } from '@/shared';
import type { SiteFormGratitude } from '../SiteFormGratitude';

export class SiteFormGratitudeFormData {
  isEnabled: BooleanModel;
  header: InputModel;
  text: InputModel;

  private constructor({
    isEnabled,
    header,
    text,
  }: {
    isEnabled: boolean;
    header?: string;
    text?: string;
  }) {
    this.isEnabled = BooleanModel.create(isEnabled);
    this.header = InputModel.create(header);
    this.text = InputModel.create(text);
  }

  static empty({
    defaultHeader,
    defaultText,
  }: {
    defaultHeader: string;
    defaultText: string;
  }): SiteFormGratitudeFormData {
    return new SiteFormGratitudeFormData({
      isEnabled: true,
      text: defaultText,
      header: defaultHeader,
    });
  }

  static fromModel(siteFormGratitude: SiteFormGratitude): SiteFormGratitudeFormData {
    return new SiteFormGratitudeFormData({
      isEnabled: siteFormGratitude.isEnabled,
      text: siteFormGratitude.text ?? undefined,
      header: siteFormGratitude.header ?? undefined,
    });
  }

  get createFormGratitudeDto(): CreateSiteFormGratitudeDto {
    return new CreateSiteFormGratitudeDto({
      isEnabled: this.isEnabled.value,
      text: this.text.trimmedValue,
      header: this.header.trimmedValue,
    });
  }

  get updateFormGratitudeDto(): UpdateSiteFormGratitudeDto {
    return new UpdateSiteFormGratitudeDto({
      isEnabled: this.isEnabled.value,
      text: this.text.trimmedValue,
      header: this.header.trimmedValue,
    });
  }
}
