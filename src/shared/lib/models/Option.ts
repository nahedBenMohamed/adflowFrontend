import type { AnyObject, Optional } from '../types';

export interface Option<Value = unknown, Extra = Optional<AnyObject>> {
  label: string;
  value: Value;
  extra?: Extra;
}
