import { type MyPopoverProps } from '../../../components/MyPopover/MyPopover';
import { type TimePickerSelectStep } from '../../../types';
import { type BusinessHours } from '../../BusinessHours';

export interface TimePickerSelectMenuPopoverProps
  extends Omit<MyPopoverProps, 'Target' | 'children'> {
  step: TimePickerSelectStep;
  businessHours?: BusinessHours;
}
