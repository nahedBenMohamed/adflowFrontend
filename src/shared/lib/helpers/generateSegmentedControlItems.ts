import { type SegmentedControlItem } from '@mantine/core';
import { type TFunction } from 'i18next';
import { type CalendarView } from '../models';

type CalendarViewVariants = CalendarView[];

/* 
Function returns array of items for MySegmentedControl component
Make sure variants elements are consistent with locale e.g.:
CalendarView.DAY === "day"
locale json: "day": "Day"
*/

export const generateSegmentedControlItems = ({
  items,
  t,
}: {
  items: CalendarViewVariants;
  t: TFunction;
}): SegmentedControlItem[] =>
  Object.values(items).map<SegmentedControlItem>(i => ({
    value: i,
    label: t(String(i)),
  }));
