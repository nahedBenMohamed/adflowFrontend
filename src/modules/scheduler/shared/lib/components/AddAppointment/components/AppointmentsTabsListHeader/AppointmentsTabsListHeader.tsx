import type { EntityForm } from '@/modules/section';
import {
  batchRequest,
  calculateEndOfWordIdxByNumber,
  type Nullable,
  PlusIcon,
  PrimaryButton,
  useModalControl,
  UtcDate,
  WarningModal,
} from '@/shared';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  invalidateSchedulerAppointmentsCache,
  invalidateSchedulerStatisticsCache,
  invalidateSchedulerTotalVisitsCache,
  scheduleAppointmentApi,
  UpdateScheduleAppointmentDto,
  updateScheduleAppointmentInCache,
  useGetScheduleAppointmentCount,
} from '../../../../../../api';
import {
  type GetScheduleAppointmentsQueryParams,
  type Schedule,
  ScheduleAppointmentModalTabs,
  ScheduleAppointmentStatus,
} from '../../../../models';
import { AddAppointmentModal } from '../../AddAppointmentModal';
import { AppointmentsTabsListHeaderComponent } from '../AppointmentsTabsListHeaderComponent/AppointmentsTabsListHeaderComponent';

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonIconWrapper = styled.div`
  width: 12px;
  height: 12px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  dateNow: string;
  performerObjectId: number;
  selectedSchedule: Schedule;
  showPlannedAndHistoryTabs: boolean;
  activeTab: ScheduleAppointmentModalTabs;
  entityId?: number;
  modalEntityForm?: Nullable<EntityForm>;
  openedFromCard?: boolean;
}

const AppointmentsTabsListHeader = memo((props: Props) => {
  const {
    dateNow,
    entityId,
    activeTab,
    showPlannedAndHistoryTabs,
    performerObjectId,
    selectedSchedule,
    modalEntityForm,
    openedFromCard,
  } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const [isCancelling, setIsCancelling] = useState(false);

  const addAppointmentFromPlannedControl = useModalControl(false);
  const cancelAllPlanedAppointmentsControl = useModalControl(false);

  const queryParams = useMemo<GetScheduleAppointmentsQueryParams>(
    () => ({
      scheduleId: selectedSchedule.id,
      entityId,
    }),
    [entityId, selectedSchedule.id]
  );

  const plannedAppointmentsQueryParams = useMemo<GetScheduleAppointmentsQueryParams>(
    () => ({
      ...queryParams,
      startDate: dateNow,
    }),
    [dateNow, queryParams]
  );

  const previousAppointmentsQueryParams = useMemo<GetScheduleAppointmentsQueryParams>(
    () => ({
      ...queryParams,
      endDate: dateNow,
    }),
    [dateNow, queryParams]
  );

  const { data: previousAppointmentsCount } = useGetScheduleAppointmentCount({
    queryParams: previousAppointmentsQueryParams,
  });

  const { data: plannedAppointmentsCount } = useGetScheduleAppointmentCount({
    queryParams: plannedAppointmentsQueryParams,
  });

  const handleCancelAllPlannedAppointments = useCallback(async (): Promise<void> => {
    setIsCancelling(true);

    const appointments = await scheduleAppointmentApi.getScheduleAppointments(
      plannedAppointmentsQueryParams
    );

    if (appointments?.appointments) {
      await batchRequest({
        array: appointments.appointments,
        cb: async (appointment): Promise<void> => {
          const dto = UpdateScheduleAppointmentDto.fromModel(appointment);
          dto.status = ScheduleAppointmentStatus.CANCELLED;

          try {
            const cancelledAppointment = await scheduleAppointmentApi.updateScheduleAppointment({
              appointmentId: appointment.id,
              dto,
            });

            updateScheduleAppointmentInCache(cancelledAppointment);
          } catch (e) {
            console.error(`Failed to cancel appointment ${appointment.id}`, e);
          }
        },
      });

      invalidateSchedulerStatisticsCache();
      invalidateSchedulerTotalVisitsCache(plannedAppointmentsQueryParams);
      invalidateSchedulerAppointmentsCache(plannedAppointmentsQueryParams);
    }

    setIsCancelling(false);
    cancelAllPlanedAppointmentsControl.close();
  }, [cancelAllPlanedAppointmentsControl, plannedAppointmentsQueryParams]);

  const cancelAllWarningAnnotation = useMemo<string>(() => {
    const idx = plannedAppointmentsCount
      ? calculateEndOfWordIdxByNumber(plannedAppointmentsCount)
      : 0;

    return t(`batch_cancel.warning_annotation.${idx}`, { count: plannedAppointmentsCount });
  }, [plannedAppointmentsCount, t]);

  return (
    <AppointmentsTabsListHeaderComponent
      openedFromCard={openedFromCard}
      plannedAppointmentsCount={plannedAppointmentsCount}
      previousAppointmentsCount={previousAppointmentsCount}
      showPlannedAndHistoryTabs={showPlannedAndHistoryTabs}
      Controls={
        activeTab === ScheduleAppointmentModalTabs.PLANNED_VISITS &&
        !openedFromCard && (
          <>
            <ButtonsWrapper>
              <PrimaryButton onClick={addAppointmentFromPlannedControl.open}>
                <ButtonIconWrapper>
                  <PlusIcon />
                </ButtonIconWrapper>

                {t('new_visit')}
              </PrimaryButton>

              {Boolean(plannedAppointmentsCount && plannedAppointmentsCount > 0) && (
                <PrimaryButton variant="danger" onClick={cancelAllPlanedAppointmentsControl.open}>
                  {t('batch_cancel.cancel_all')}
                </PrimaryButton>
              )}
            </ButtonsWrapper>

            {addAppointmentFromPlannedControl.opened && selectedSchedule && modalEntityForm && (
              <AddAppointmentModal
                schedule={selectedSchedule}
                currentAppointmentId={null}
                opened={addAppointmentFromPlannedControl.opened}
                preset={{
                  performerObjectId,
                  startDate: UtcDate.parseISO(dateNow),
                  endDate: UtcDate.parseISO(dateNow),
                  entity: modalEntityForm.originalEntity,
                }}
                // should match planned visits query params in AppointmentPlannedVisits
                queryParams={{
                  startDate: dateNow,
                  entityId: modalEntityForm.id,
                  scheduleId: selectedSchedule.id,
                }}
                onClose={addAppointmentFromPlannedControl.close}
              />
            )}

            {cancelAllPlanedAppointmentsControl.opened && (
              <WarningModal
                height="fit-content"
                maxHeight="fit-content"
                approveLoading={isCancelling}
                cancelTitle={t('batch_cancel.back')}
                approveTitle={t('batch_cancel.cancel')}
                title={t('batch_cancel.warning_title')}
                annotation={cancelAllWarningAnnotation}
                onApprove={handleCancelAllPlannedAppointments}
                onClose={cancelAllPlanedAppointmentsControl.close}
                isOpened={cancelAllPlanedAppointmentsControl.opened}
              />
            )}
          </>
        )
      }
    />
  );
});

AppointmentsTabsListHeader.displayName = 'AppointmentsTabsListHeader';
export { AppointmentsTabsListHeader };
