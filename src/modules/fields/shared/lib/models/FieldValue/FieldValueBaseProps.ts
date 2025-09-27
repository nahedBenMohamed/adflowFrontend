import type { PossibleFieldValue } from '../../types';
import type { Field } from '../Field/Field';
import type { FieldSettings } from '../FieldSettings/FieldSettings';

export interface FieldSettingsProps {
  fieldSettings?: FieldSettings;
}

export interface FieldValueBaseProps<FieldValue extends PossibleFieldValue>
  extends FieldSettingsProps {
  field: Field;
  fieldValue: FieldValue;
  tableView?: boolean;
  readonly?: boolean;
  alwaysHideIndicator?: boolean;
  rightIndicatorOnMobile?: boolean;
  onChange?: (fieldValue: FieldValue) => void;
}
