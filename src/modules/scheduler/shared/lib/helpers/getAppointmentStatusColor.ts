import { ScheduleAppointmentStatus } from '../models';

export const getAppointmentStatusColor = (status: ScheduleAppointmentStatus): string => {
  switch (status) {
    case ScheduleAppointmentStatus.NOT_CONFIRMED:
      return 'var(--primary-statuses-turquoise-520)';

    case ScheduleAppointmentStatus.CONFIRMED:
      return 'var(--primary-statuses-green-520)';

    case ScheduleAppointmentStatus.COMPLETED:
      return 'var(--primary-statuses-orange-440)';

    case ScheduleAppointmentStatus.CANCELLED:
      return 'var(--primary-statuses-red-360)';
  }
};
