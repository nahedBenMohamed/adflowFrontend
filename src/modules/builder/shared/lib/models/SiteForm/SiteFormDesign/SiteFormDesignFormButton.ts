import type { SiteFormBorder } from './SiteFormBorder';
import type { SiteFormFontSize } from './SiteFormFontSize';

export class SiteFormDesignFormButton {
  backgroundColor: string;
  textColor: string;
  buttonSize: SiteFormFontSize;
  buttonText: string;
  border: SiteFormBorder;

  constructor({
    backgroundColor,
    textColor,
    buttonSize,
    buttonText,
    border,
  }: SiteFormDesignFormButton) {
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.buttonSize = buttonSize;
    this.buttonText = buttonText;
    this.border = border;
  }
}
