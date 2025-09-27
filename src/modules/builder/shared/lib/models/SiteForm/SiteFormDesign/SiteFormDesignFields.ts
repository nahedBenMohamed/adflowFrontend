import type { SiteFormFontSize } from './SiteFormFontSize';

export class SiteFormDesignFields {
  backgroundColor: string;

  // label –> above fields
  labelColor: string;
  labelFontSize: SiteFormFontSize;

  // text -> inside fields
  fieldColor: string;
  fieldFontSize: SiteFormFontSize;

  constructor({
    backgroundColor,
    labelColor,
    labelFontSize,
    fieldColor,
    fieldFontSize,
  }: SiteFormDesignFields) {
    this.backgroundColor = backgroundColor;
    this.labelColor = labelColor;
    this.labelFontSize = labelFontSize;
    this.fieldColor = fieldColor;
    this.fieldFontSize = fieldFontSize;
  }
}
