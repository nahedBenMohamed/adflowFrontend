import {
  ChecklistFieldValue,
  ColoredMultiselectFieldValue,
  ColoredSelectFieldValue,
  DateFieldValue,
  FileFieldValue,
  FormulaFieldValue,
  LinkFieldValue,
  MultiselectFieldValue,
  MultitextFieldValue,
  NumberFieldValue,
  ParticipantFieldValue,
  ParticipantsFieldValue,
  SelectFieldValue,
  SwitchFieldValue,
  TextFieldValue,
} from '../models';

export type PossibleFieldValue =
  | TextFieldValue
  | NumberFieldValue
  | MultitextFieldValue
  | SelectFieldValue
  | MultiselectFieldValue
  | SwitchFieldValue
  | DateFieldValue
  | LinkFieldValue
  | ParticipantsFieldValue
  | ParticipantFieldValue
  | ColoredSelectFieldValue
  | ColoredMultiselectFieldValue
  | FileFieldValue
  | ChecklistFieldValue
  | FormulaFieldValue;
