import type { Nullable } from '@/shared';

export class CreateSiteFormGratitudeDto {
  isEnabled: boolean;
  header?: Nullable<string>;
  text?: Nullable<string>;

  constructor({ isEnabled, header, text }: CreateSiteFormGratitudeDto) {
    this.isEnabled = isEnabled;
    this.header = header;
    this.text = text;
  }
}
