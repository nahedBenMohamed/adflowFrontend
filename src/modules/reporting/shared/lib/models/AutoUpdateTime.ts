import { AutoUpdateMode } from './AutoUpdateMode';

const MINUTE = 1 * 60 * 1000;
const TEN_MINUTES = MINUTE * 10;
const THIRTY_MINUTES = MINUTE * 30;
const HOUR = MINUTE * 60;

export const AutoUpdateTime: Partial<Record<AutoUpdateMode, number>> = {
  [AutoUpdateMode.MINUTE]: MINUTE,
  [AutoUpdateMode.TEN_MINUTES]: TEN_MINUTES,
  [AutoUpdateMode.THIRTY_MINUTES]: THIRTY_MINUTES,
  [AutoUpdateMode.HOUR]: HOUR,
};
