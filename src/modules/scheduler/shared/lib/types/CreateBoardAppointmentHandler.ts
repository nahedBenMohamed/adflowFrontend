import type { UtcDate } from '@/shared';

export type CreateBoardAppointmentHandler = ({
  startDate,
  endDate,
}: {
  startDate: UtcDate;
  endDate: UtcDate;
}) => void;
