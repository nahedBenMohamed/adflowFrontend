import type { CallFromNumber, CallFromSipRegId } from '../../models';

export type SetLastCallFromHandler = (callFrom: CallFromNumber | CallFromSipRegId) => void;
