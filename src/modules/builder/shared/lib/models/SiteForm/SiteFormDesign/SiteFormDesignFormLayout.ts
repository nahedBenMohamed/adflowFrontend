import type { Nullable } from '@/shared';
import type { SiteFormBorder } from './SiteFormBorder';
import type { SiteFormOrientation } from './SiteFormOrientation';
import type { SiteFormPosition } from './SiteFormPosition';
import type { SiteFormView } from './SiteFormView';

export class SiteFormDesignFormLayout {
  view: SiteFormView;
  position: SiteFormPosition;
  border: SiteFormBorder;
  orientation: SiteFormOrientation;

  maxWidthEnabled: boolean;
  maxWidth: Nullable<string>;

  maxHeightEnabled: boolean;
  maxHeight: Nullable<string>;

  backgroundColor: string;

  constructor({
    view,
    position,
    border,
    orientation,
    maxWidthEnabled,
    maxWidth,
    maxHeightEnabled,
    maxHeight,
    backgroundColor,
  }: SiteFormDesignFormLayout) {
    this.view = view;
    this.position = position;
    this.border = border;
    this.orientation = orientation;
    this.maxWidthEnabled = maxWidthEnabled;
    this.maxWidth = maxWidth;
    this.maxHeightEnabled = maxHeightEnabled;
    this.maxHeight = maxHeight;
    this.backgroundColor = backgroundColor;
  }
}
