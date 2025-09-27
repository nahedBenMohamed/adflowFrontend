import { generateMyDatePickerRangeTitle, type Optional, type UtcDatesRangeValue } from '@/shared';
import type { TFunction } from 'i18next';

export const generateRentalOrderPeriodsControlTitle = ({
  periods,
  t,
}: {
  periods: UtcDatesRangeValue[];
  t: TFunction;
}): Optional<string> => {
  if (!periods[0]) return;

  if (periods.length === 1) return generateMyDatePickerRangeTitle(periods[0]);

  if (periods.length > 1) return t('periods_selected', { count: periods.length });
};
