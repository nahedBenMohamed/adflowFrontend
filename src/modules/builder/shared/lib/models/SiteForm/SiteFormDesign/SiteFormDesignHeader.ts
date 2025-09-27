import type { SiteFormFontSize } from './SiteFormFontSize';
import type { SiteFormTextOrientation } from './SiteFormTextOrientation';

export class SiteFormDesignHeader {
  textColor: string;
  fontSize: SiteFormFontSize;
  orientation: SiteFormTextOrientation;

  constructor({ textColor, fontSize, orientation }: SiteFormDesignHeader) {
    this.textColor = textColor;
    this.fontSize = fontSize;
    this.orientation = orientation;
  }
}
