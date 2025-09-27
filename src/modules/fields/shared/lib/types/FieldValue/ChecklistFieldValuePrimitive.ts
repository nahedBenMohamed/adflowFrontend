import type { PrimitiveValue } from '../PrimitiveValue';

export interface ChecklistFieldPayloadItem {
  text: string;
  checked: boolean;
}

export type ChecklistFieldValuePrimitive = PrimitiveValue<ChecklistFieldPayloadItem[]>;
