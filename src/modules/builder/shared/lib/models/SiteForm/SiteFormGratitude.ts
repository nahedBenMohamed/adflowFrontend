import type { Nullable } from '@/shared';
import type { SiteFormGratitudeDto } from '../../../../api';

export class SiteFormGratitude {
  formId: number;
  isEnabled: boolean;
  header?: Nullable<string>;
  text?: Nullable<string>;

  constructor({ formId, isEnabled, header, text }: SiteFormGratitude) {
    this.formId = formId;
    this.isEnabled = isEnabled;
    this.header = header;
    this.text = text;
  }

  static fromDto(dto: SiteFormGratitudeDto): SiteFormGratitude {
    return new SiteFormGratitude({
      formId: dto.formId,
      isEnabled: dto.isEnabled,
      header: dto.header,
      text: dto.text,
    });
  }
}
