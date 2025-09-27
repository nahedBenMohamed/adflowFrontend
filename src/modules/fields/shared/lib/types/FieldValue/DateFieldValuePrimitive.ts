import type { Nullable, UtcDateValue } from '@/shared';
import type { PrimitiveValue } from '../PrimitiveValue';

export type DateFieldValuePrimitive = PrimitiveValue<UtcDateValue>;
export type DateFieldValueDtoPrimitive = PrimitiveValue<Nullable<string>>;
