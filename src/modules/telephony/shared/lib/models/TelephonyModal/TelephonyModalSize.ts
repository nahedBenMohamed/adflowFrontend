import type { CSSProperties } from 'react';

export interface TelephonyModalSize<T = CSSProperties['width'], U = CSSProperties['height']> {
  width: T;
  height: U;
}
