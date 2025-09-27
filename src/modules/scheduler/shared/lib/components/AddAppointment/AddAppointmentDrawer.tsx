import {
  type Entity,
  lastSchedulerService,
  MyDrawer,
  type Nullable,
  useErrorMessageIdle,
  useModalControl,
  UtcDate,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddAppointmentModalStore } from '../../../../store';
import {
  type Schedule,
  ScheduleAppointmentDuplicateError,
  ScheduleAppointmentIntersectError,
  ScheduleAppointmentModalTabs,
} from '../../models';
import { AddAppointmentControl } from './AddAppointmentControl';
import {
  AddAppointmentDrawerControls,
  AddAppointmentDrawerHeader,
  AddAppointmentWarningModal,
  AppointmentDuplicateWarningModal,
  AppointmentIntersectWarningModal,
} from './components';

interface Props {
  entity: Entity;
  schedules: Schedule[];
  opened: boolean;
  hide: () => void;
  killDrawerState: () => void;
}

const AddAppointmentDrawer = observer((props: Props) => {
  const { entity, schedules, opened, hide, killDrawerState } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const savedScheduleId = lastSchedulerService.getLastSchedulerId(entity.entityTypeId);
  const savedOrFirstSchedule = schedules.find(s => s.id === savedScheduleId) ?? schedules[0];

  if (!savedOrFirstSchedule)
    // we checked it's existence in the parent component,
    // this is just to please TS, this condition should never be true
    throw new Error(
      `Failed to identify schedule, can not create appointment unless schedule is specified.`
    );

  const { error, idle } = useErrorMessageIdle(t('error'), 7000);

  const warningModalControl = useModalControl(false);
  const duplicateWarningModalControl = useModalControl(false);
  const intersectWarningModalControl = useModalControl(false);

  const [duplicateAppointmentId, setDuplicateAppointmentId] = useState<Nullable<number>>(null);

  const defaultStartDate = useMemo(() => UtcDate.now(), []);
  const defaultEndDate = useMemo(() => UtcDate.now().addHours(1), []);

  const appointmentModalStore = useMemo(
    () =>
      new AddAppointmentModalStore({
        appointmentId: null,
        openedFromCard: true,
        selectedSchedule: savedOrFirstSchedule,
        preset: {
          scheduleId: savedOrFirstSchedule.id,
          startDate: defaultStartDate,
          endDate: defaultEndDate,
          entity,
        },
      }),
    [savedOrFirstSchedule, entity, defaultEndDate, defaultStartDate]
  );

  const [activeTab, setActiveTab] = useState<ScheduleAppointmentModalTabs>(
    ScheduleAppointmentModalTabs.GENERAL_INFORMATION
  );

  const { isSaving, appointmentOrderStore, isJsonStateChanged, save } = appointmentModalStore;

  const stateChanged = isJsonStateChanged() || appointmentOrderStore?.isJsonStateChanged();

  const closeAndKillState = useCallback(() => {
    hide();
    killDrawerState();
  }, [hide, killDrawerState]);

  const handleApprove = useCallback(async (): Promise<void> => {
    try {
      const saved = await save({ t });

      if (saved) closeAndKillState();
    } catch (e) {
      if (e instanceof ScheduleAppointmentDuplicateError) {
        setDuplicateAppointmentId(e.appointmentId);

        duplicateWarningModalControl.open();
      } else if (e instanceof ScheduleAppointmentIntersectError) {
        intersectWarningModalControl.open();
      } else {
        idle();

        console.error('Failed to save visit from AddAppointmentDrawer:', e);
      }
    }
  }, [
    closeAndKillState,
    duplicateWarningModalControl,
    intersectWarningModalControl,
    idle,
    save,
    t,
  ]);

  const handleClose = useCallback(() => {
    if (stateChanged) {
      warningModalControl.open();
    } else {
      closeAndKillState();
    }
  }, [stateChanged, warningModalControl, closeAndKillState]);

  const handleApproveWarning = useCallback(() => {
    warningModalControl.close();

    closeAndKillState();
  }, [warningModalControl, closeAndKillState]);

  const handleChangeTab = useCallback((value: Nullable<string>) => {
    if (value) setActiveTab(value as ScheduleAppointmentModalTabs);
  }, []);

  return (
    <>
      <MyDrawer
        width="544px"
        opened={opened}
        Header={<AddAppointmentDrawerHeader />}
        Controls={
          <AddAppointmentDrawerControls
            error={error}
            saving={isSaving}
            entityId={entity.id}
            countEnabled={activeTab === ScheduleAppointmentModalTabs.VISITS_HISTORY}
            scheduleId={appointmentModalStore.visitParametersFormData.selectedSchedule?.id}
            onSave={handleApprove}
            onCancel={handleClose}
          />
        }
        hide={handleClose}
      >
        {opened && (
          <AddAppointmentControl
            showTabsList
            openedFromCard
            entityId={entity.id}
            schedules={schedules}
            activeTab={activeTab}
            appointmentModalStore={appointmentModalStore}
            handleChangeTab={handleChangeTab}
            WarningModal={
              warningModalControl.opened && (
                <AddAppointmentWarningModal
                  isEditMode={false}
                  opened={warningModalControl.opened}
                  onApprove={handleApproveWarning}
                  onClose={warningModalControl.close}
                />
              )
            }
          />
        )}
      </MyDrawer>

      {duplicateWarningModalControl.opened && duplicateAppointmentId !== null ? (
        <AppointmentDuplicateWarningModal
          handleSave={handleApprove}
          appointmentId={duplicateAppointmentId}
          onClose={duplicateWarningModalControl.close}
          isOpened={duplicateWarningModalControl.opened}
          currentStartDate={appointmentModalStore.visitParametersFormData.startDate}
        />
      ) : null}

      {intersectWarningModalControl.opened && (
        <AppointmentIntersectWarningModal
          onClose={intersectWarningModalControl.close}
          isOpened={intersectWarningModalControl.opened}
        />
      )}
    </>
  );
});

AddAppointmentDrawer.displayName = 'AddAppointmentDrawer';
export { AddAppointmentDrawer };
