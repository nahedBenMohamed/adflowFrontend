import { type UtcDate, WarningModal } from '@/shared';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  scheduleAppointmentApi,
  UpdateScheduleAppointmentDto,
  updateScheduleAppointmentInCache,
  useGetScheduleAppointment,
} from '../../../../../../api';
import { ScheduleAppointmentStatus } from '../../../../models';

interface Props {
  appointmentId: number;
  isOpened: boolean;
  currentStartDate: UtcDate;
  handleSave: () => Promise<void>;
  onClose: () => void;
}

const AppointmentDuplicateWarningModal = (props: Props) => {
  const { appointmentId, isOpened, currentStartDate, handleSave, onClose } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal.duplicate_warning_modal',
  });

  const [isMoving, setIsMoving] = useState(false);

  const { data: appointment, isLoading: isAppointmentLoading } =
    useGetScheduleAppointment(appointmentId);

  const isSameTime = useMemo<boolean>(
    () => appointment?.startDate.isEqual(currentStartDate) ?? false,
    [appointment?.startDate, currentStartDate]
  );

  const handleApprove = useCallback(async (): Promise<void> => {
    if (!appointment) return;

    if (isSameTime) return onClose();

    try {
      setIsMoving(true);

      const cancelDto = UpdateScheduleAppointmentDto.fromModel(appointment);
      cancelDto.status = ScheduleAppointmentStatus.CANCELLED;

      const cancelledAppointment = await scheduleAppointmentApi.updateScheduleAppointment({
        appointmentId: appointment.id,
        dto: cancelDto,
      });
      updateScheduleAppointmentInCache(cancelledAppointment);

      await handleSave();
      onClose();
    } catch (e) {
      console.error(`Failed to move duplicate appointment ${appointment.id}`, e);
    } finally {
      setIsMoving(false);
    }
  }, [appointment, handleSave, isSameTime, onClose]);

  if (!appointment) return null;

  return (
    <WarningModal
      icon="warning"
      isOpened={isOpened}
      height="fit-content"
      maxHeight="fit-content"
      hideApprove={isSameTime}
      approveTitle={t('move')}
      approveLoading={isMoving}
      approveDisabled={isAppointmentLoading}
      title={isSameTime ? t('same_time_title') : t('same_day_title')}
      annotation={
        isSameTime
          ? t('same_time_annotation')
          : t('same_day_annotation', { time: appointment.startDate.displayTime() })
      }
      onClose={onClose}
      onApprove={handleApprove}
    />
  );
};

export { AppointmentDuplicateWarningModal };
