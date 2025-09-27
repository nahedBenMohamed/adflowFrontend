import type { UtcDate } from '@/shared';
import type { VoximplantCall } from './Voximplant/VoximplantCall';

export interface RecentCallsGroup {
  date: UtcDate;
  calls: VoximplantCall[];
}
