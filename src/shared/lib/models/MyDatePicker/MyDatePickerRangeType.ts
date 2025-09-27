import { type DatePickerType } from '@mantine/dates';

export type MyDatePickerRangeType = Exclude<DatePickerType, 'multiple'>;
