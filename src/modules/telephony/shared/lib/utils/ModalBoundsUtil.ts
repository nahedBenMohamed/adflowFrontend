import type { TelephonyModalPosition, TelephonyModalSize } from '../models';

export class ModalBoundsUtil {
  static get defaultModalSize(): TelephonyModalSize<number, number> {
    return {
      width: 384,
      height: 606,
    };
  }

  static get foldedModalSize(): TelephonyModalSize<number, number> {
    return {
      width: 288,
      height: 136,
    };
  }

  static get activeCallModalSize(): TelephonyModalSize<number, number> {
    return {
      width: 480,
      height: 428,
    };
  }

  static get defaultModalPosition(): TelephonyModalPosition {
    const windowInnerHeight = window.innerHeight;

    const defaultModalSize = this.defaultModalSize;

    return {
      x: (window.innerWidth - defaultModalSize.width) / 2,
      y: (windowInnerHeight - defaultModalSize.height) / 2,
    };
  }

  static get foldedModalPosition(): TelephonyModalPosition {
    const headerHeight = 56;
    const offset = 16;

    return {
      x: window.innerWidth - this.foldedModalSize.width - offset,
      y: headerHeight + offset,
    };
  }
}
