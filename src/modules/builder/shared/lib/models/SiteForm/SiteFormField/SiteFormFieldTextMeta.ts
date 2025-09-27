import type { SiteFormFieldTextMetaDto } from '../../../../../api';
import type { SiteFormFieldTextView } from './SiteFormFieldTextView';

export class SiteFormFieldTextMeta {
  view: SiteFormFieldTextView;

  constructor({ view }: SiteFormFieldTextMeta) {
    this.view = view;
  }

  static fromDto(dto: SiteFormFieldTextMetaDto): SiteFormFieldTextMeta {
    return new SiteFormFieldTextMeta({
      view: dto.view,
    });
  }
}
