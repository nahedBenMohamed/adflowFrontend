import type { RentalStatus } from '../Product/RentalStatus';

export interface EventShort {
  id: string;
  end: string;
  start: string;
  title?: string;
  status: RentalStatus;
  className: RentalStatus;
}
