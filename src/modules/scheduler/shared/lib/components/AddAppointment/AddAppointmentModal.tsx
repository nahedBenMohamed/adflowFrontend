import { appStore } from '@/app';
import {
  DialogModalSecondary,
  type Nullable,
  useErrorMessageIdle,
  useModalControl,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddAppointmentModalStore } from '../../../../store';
import {
  type AddAppointmentPreset,
  type GetScheduleAppointmentsQueryParams,
  type Schedule,
  ScheduleAppointmentDuplicateError,
  ScheduleAppointmentIntersectError,
  ScheduleAppointmentModalTabs,
} from '../../models';
import {
  AddAppointmentControl,
  type AddAppointmentControlModalProps,
} from './AddAppointmentControl';
import {
  AddAppointmentWarningModal,
  AppointmentDuplicateWarningModal,
  AppointmentIntersectWarningModal,
  CompletedAppointmentsCount,
} from './components';

interface Props {
  schedule: Schedule;
  opened: boolean;
  currentAppointmentId: Nullable<number>;
  preset: Nullable<AddAppointmentPreset>;
  queryParams?: GetScheduleAppointmentsQueryParams;
  onClose: () => void;
}

const AddAppointmentModal = observer((props: Props) => {
  const { schedule, opened, currentAppointmentId, preset, queryParams, onClose } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const { error, idle } = useErrorMessageIdle(t('error'), 7000);

  const warningModalControl = useModalControl(false);
  const duplicateWarningModalControl = useModalControl(false);
  const intersectWarningModalControl = useModalControl(false);

  const [duplicateAppointmentId, setDuplicateAppointmentId] = useState<Nullable<number>>(null);

  const [activeTab, setActiveTab] = useState<ScheduleAppointmentModalTabs>(
    ScheduleAppointmentModalTabs.GENERAL_INFORMATION
  );

  const handleChangeTab = useCallback((value: Nullable<string>) => {
    if (value) setActiveTab(value as ScheduleAppointmentModalTabs);
  }, []);

  const appointmentModalStore = useMemo(
    () =>
      new AddAppointmentModalStore({
        selectedSchedule: schedule,
        appointmentId: currentAppointmentId,
        preset: { ...preset, scheduleId: schedule.id },
      }),
    [currentAppointmentId, preset, schedule]
  );

  const {
    isLoaded,
    isSaving,
    entityForm,
    appointment,
    appointmentOrderStore,
    isJsonStateChanged,
    save,
  } = appointmentModalStore;

  useEffect(() => {
    if (appStore.isLoaded) appointmentModalStore.loadData();
  }, [appointmentModalStore]);

  const stateChanged = isJsonStateChanged() || appointmentOrderStore?.isJsonStateChanged();

  const handleApprove = useCallback(async (): Promise<void> => {
    try {
      const saved = await save({ queryParams, t });

      if (saved) onClose();
    } catch (e) {
      if (e instanceof ScheduleAppointmentDuplicateError) {
        setDuplicateAppointmentId(e.appointmentId);

        duplicateWarningModalControl.open();
      } else if (e instanceof ScheduleAppointmentIntersectError) {
        intersectWarningModalControl.open();
      } else {
        idle();

        console.error('Failed to save visit from AddAppointmentModal:', e);
      }
    }
  }, [
    save,
    queryParams,
    duplicateWarningModalControl,
    intersectWarningModalControl,
    onClose,
    idle,
    t,
  ]);

  const handleClose = useCallback(() => {
    if (stateChanged) {
      warningModalControl.open();
    } else {
      onClose();
    }
  }, [warningModalControl, stateChanged, onClose]);

  // We do not consider being in edit mode if no entity is selected in visit, because
  // in this case we can't show not visits history nor planned visits nor services
  const editMode = Boolean(currentAppointmentId && appointmentModalStore.entityForm);

  const modalProps = useMemo<AddAppointmentControlModalProps>(
    () => ({ editMode, entityForm, queryParams }),
    [editMode, entityForm, queryParams]
  );

  const schedules = useMemo<Schedule[]>(() => [schedule], [schedule]);

  return (
    isLoaded && (
      <>
        <DialogModalSecondary
          width="100%"
          isOpened={opened}
          loading={isSaving}
          errorMessage={error}
          approveDisabled={isSaving}
          maxHeight={editMode ? '732px' : '100%'}
          maxWidth={editMode ? '1200px' : '640px'}
          height={editMode ? undefined : 'fit-content'}
          Header={
            appointment
              ? t('edit_visit', { name: appointment.title ?? `#${appointment.id}` })
              : t('new_visit')
          }
          LeftControls={
            <CompletedAppointmentsCount
              scheduleId={schedule.id}
              entityId={entityForm?.id}
              enabled={activeTab === ScheduleAppointmentModalTabs.VISITS_HISTORY}
            />
          }
          onClose={handleClose}
          onApprove={handleApprove}
        >
          <AddAppointmentControl
            schedules={schedules}
            activeTab={activeTab}
            modalProps={modalProps}
            entityId={entityForm?.id}
            currentAppointmentId={currentAppointmentId}
            appointmentModalStore={appointmentModalStore}
            showTabsList={Boolean(editMode && entityForm)}
            WarningModal={
              warningModalControl.opened && (
                <AddAppointmentWarningModal
                  opened={warningModalControl.opened}
                  isEditMode={Boolean(currentAppointmentId)}
                  onApprove={onClose}
                  onClose={warningModalControl.close}
                />
              )
            }
            handleChangeTab={handleChangeTab}
          />
        </DialogModalSecondary>

        {duplicateWarningModalControl.opened && duplicateAppointmentId !== null ? (
          <AppointmentDuplicateWarningModal
            appointmentId={duplicateAppointmentId}
            isOpened={duplicateWarningModalControl.opened}
            currentStartDate={appointmentModalStore.visitParametersFormData.startDate}
            handleSave={handleApprove}
            onClose={duplicateWarningModalControl.close}
          />
        ) : null}

        {intersectWarningModalControl.opened && (
          <AppointmentIntersectWarningModal
            onClose={intersectWarningModalControl.close}
            isOpened={intersectWarningModalControl.opened}
          />
        )}
      </>
    )
  );
});

AddAppointmentModal.displayName = 'AddAppointmentModal';
export { AddAppointmentModal };
