import type { Nullable } from '@/shared';

export class UpdateSiteFormGratitudeDto {
  isEnabled: boolean;
  header?: Nullable<string>;
  text?: Nullable<string>;

  constructor({ isEnabled, header, text }: UpdateSiteFormGratitudeDto) {
    this.isEnabled = isEnabled;
    this.header = header;
    this.text = text;
  }
}
