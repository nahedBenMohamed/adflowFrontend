import type { Nullable } from '@/shared';
import type { StringFilterType } from './StringFilterType';

export class EntityFieldFilterString {
  type?: StringFilterType;
  text?: Nullable<string>;

  constructor({ type, text }: EntityFieldFilterString) {
    this.type = type;
    this.text = text;
  }
}
