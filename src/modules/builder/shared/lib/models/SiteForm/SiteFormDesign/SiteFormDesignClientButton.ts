import type { SiteFormBorder } from './SiteFormBorder';
import type { SiteFormFontSize } from './SiteFormFontSize';

export class SiteFormDesignClientButton {
  enabled: boolean;

  backgroundColor: string;
  textColor: string;
  buttonSize: SiteFormFontSize;
  buttonText: string;
  border: SiteFormBorder;

  constructor({
    enabled,
    backgroundColor,
    textColor,
    buttonSize,
    buttonText,
    border,
  }: SiteFormDesignClientButton) {
    this.enabled = enabled;

    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.buttonSize = buttonSize;
    this.buttonText = buttonText;
    this.border = border;
  }
}
