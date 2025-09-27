import type { ColoredMultiselectFieldValuePrimitive } from './ColoredMultiselectFieldValuePrimitive';
import type { ColoredSelectFieldValuePrimitive } from './ColoredSelectFieldValuePrimitive';
import type { DateFieldValueDtoPrimitive } from './DateFieldValuePrimitive';
import type { FileFieldValuePrimitive } from './FileFieldValuePrimitive';
import type { LinkFieldValuePrimitive } from './LinkFieldValuePrimitive';
import type { MultiselectFieldValuePrimitive } from './MultiselectFieldValuePrimitive';
import type { MultitextFieldValuePrimitive } from './MultitextFieldValuePrimitive';
import type { NumberFieldValuePrimitive } from './NumberFieldValuePrimitive';
import type { ParticipantsFieldValuePrimitive } from './ParticipantsFieldValuePrimitive';
import type { SelectFieldValuePrimitive } from './SelectFieldValuePrimitive';
import type { SwitchFieldValuePrimitive } from './SwitchFieldValuePrimitive';
import type { TextFieldValuePrimitive } from './TextFieldValuePrimitive';

export type PossiblePrimitiveFieldValue =
  | ColoredMultiselectFieldValuePrimitive
  | ColoredSelectFieldValuePrimitive
  | DateFieldValueDtoPrimitive
  | LinkFieldValuePrimitive
  | MultiselectFieldValuePrimitive
  | MultitextFieldValuePrimitive
  | NumberFieldValuePrimitive
  | ParticipantsFieldValuePrimitive
  | SelectFieldValuePrimitive
  | SwitchFieldValuePrimitive
  | FileFieldValuePrimitive
  | TextFieldValuePrimitive;
