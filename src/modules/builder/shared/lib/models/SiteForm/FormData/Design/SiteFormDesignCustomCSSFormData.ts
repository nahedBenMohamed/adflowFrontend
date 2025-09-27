import { BooleanModel, InputModel } from '@/shared';
import { SiteFormCustomCSS } from '../../SiteFormDesign/SiteFormCustomCSS';

export class SiteFormDesignCustomCSSFormData {
  customCss: InputModel;
  enabled: BooleanModel;

  constructor({ customCss, enabled }: { customCss: string; enabled: boolean }) {
    this.customCss = InputModel.create(customCss);
    this.enabled = BooleanModel.create(enabled);
  }

  static fromModel(model: SiteFormCustomCSS): SiteFormDesignCustomCSSFormData {
    return new SiteFormDesignCustomCSSFormData({
      customCss: model.customCss,
      enabled: model.enabled,
    });
  }

  static empty(): SiteFormDesignCustomCSSFormData {
    return new SiteFormDesignCustomCSSFormData({
      customCss: '',
      enabled: false,
    });
  }

  toModel = (): SiteFormCustomCSS => {
    return new SiteFormCustomCSS({
      customCss: this.customCss.value,
      enabled: this.enabled.value,
    });
  };
}
