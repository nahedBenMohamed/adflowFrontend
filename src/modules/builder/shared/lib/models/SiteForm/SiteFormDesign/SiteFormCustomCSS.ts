export class SiteFormCustomCSS {
  customCss: string;
  enabled: boolean;

  constructor({ customCss, enabled }: SiteFormCustomCSS) {
    this.customCss = customCss;
    this.enabled = enabled;
  }
}
