import { userStore } from '@/app';
import { departmentsSettingsStore } from '@/modules/settings';
import {
  DepartmentsSelect,
  lastSchedulerService,
  MyInput,
  MySelect,
  MySelectColored,
  MyTextArea,
  MyUsersSelect,
  type Nullable,
  type Option,
  type User,
} from '@/shared';
import { useDidUpdate } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetBoardSchedulerBusinessHours,
  useGetScheduleAppointmentStatusesOptions,
} from '../../../../hooks';
import {
  ScheduleAppointmentStatus,
  SchedulePerformerType,
  type Schedule,
  type VisitParametersFormData,
} from '../../../../models';
import { AppointmentBlock } from '../AppointmentBlock/AppointmentBlock';
import { AppointmentDateAndTimeFormItem } from '../AppointmentDateAndTimeFormItem/AppointmentDateAndTimeFormItem';
import { AppointmentFormItem } from '../AppointmentFormItem/AppointmentFormItem';

interface Props {
  schedules: Schedule[];
  formData: VisitParametersFormData;
  styles?: CSSProperties;
  openedFromCard?: boolean;
  entityTypeId?: Nullable<number>;
  currentAppointmentId?: Nullable<number>;
}

const AppointmentVisitParameters = observer((props: Props) => {
  const {
    schedules,
    formData: {
      title,
      status,
      endTime,
      comment,
      dayValue,
      startTime,
      scheduleId,
      timePeriodModel,
      performerObjectId,
      setSelectedSchedule,
    },
    styles,
    entityTypeId,
    openedFromCard,
    currentAppointmentId,
  } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const statuses = useGetScheduleAppointmentStatusesOptions();

  const selectedSchedule = useMemo<Nullable<Schedule>>(
    () => schedules.find(s => s.id === scheduleId.value) ?? null,
    [schedules, scheduleId.value]
  );

  const { businessHours } = useGetBoardSchedulerBusinessHours({
    schedule: selectedSchedule ?? undefined,
    performerObjectId: performerObjectId.value,
  });

  useDidUpdate(() => {
    setSelectedSchedule(selectedSchedule);
  }, [selectedSchedule]);

  const appointmentStatuses = useMemo(() => {
    if (!currentAppointmentId)
      return statuses.filter(s => s.value !== ScheduleAppointmentStatus.CANCELLED);

    return statuses;
  }, [statuses, currentAppointmentId]);

  const schedulesOptions = useMemo<Option<number>[]>(
    () =>
      schedules.map(s => ({
        label: s.name,
        value: s.id,
      })),
    [schedules]
  );

  const performersUsersOptions = useMemo<User[]>(
    () =>
      selectedSchedule?.performers
        .filter(p => p.type === SchedulePerformerType.USER)
        .map<User>(u => {
          if (u.userId) return userStore.getById(u.userId);

          throw new Error(
            `Performer with type ${SchedulePerformerType.USER} should have userId, received ${u.userId}`
          );
        }) ?? [],
    [selectedSchedule]
  );

  const performersDepartmentsIncludeArray = useMemo<number[]>(
    () =>
      selectedSchedule?.performers
        .filter(p => p.type === SchedulePerformerType.DEPARTMENT)
        .map<number>(d => {
          if (d.departmentId) return d.departmentId;

          throw new Error(
            `Performer with type ${SchedulePerformerType.DEPARTMENT} should have departmentId, received ${d.departmentId}`
          );
        }) ?? [],
    [selectedSchedule?.performers]
  );

  const handleChangeSchedule = useCallback(
    (schedulerId: number) => {
      if (entityTypeId) lastSchedulerService.setLastSchedulerId({ entityTypeId, schedulerId });

      // we want to clear performer when we change schedule because there is a chance
      // that performer will not be available in performerIds of the newly selected schedule
      performerObjectId.value = null;
    },
    [entityTypeId, performerObjectId]
  );

  return (
    <AppointmentBlock
      styles={styles}
      openedFromCard={openedFromCard}
      headerTitle={t('visit_parameters')}
    >
      <AppointmentFormItem label={t('status')}>
        <MySelectColored withinPortal options={appointmentStatuses} model={status} />
      </AppointmentFormItem>

      <AppointmentFormItem label={t('title')}>
        <MyInput variant="outlined" model={title} placeholder={t('placeholders.title')} />
      </AppointmentFormItem>

      <AppointmentFormItem label={t('scheduler')}>
        <MySelect
          // we can select only that scheduler in which we are now,
          // but when we are creating visit from card with multiple linked schedulers ->
          // we can select any of them
          withinPortal
          model={scheduleId}
          options={schedulesOptions}
          disabled={!openedFromCard}
          variant="outlined-without-active-shadow"
          handleChange={handleChangeSchedule}
        />
      </AppointmentFormItem>

      {selectedSchedule && (
        <AppointmentFormItem
          label={
            selectedSchedule.performersType === SchedulePerformerType.USER
              ? t('select_user')
              : t('select_users_group')
          }
        >
          {selectedSchedule.performersType === SchedulePerformerType.USER ? (
            <MyUsersSelect
              withinPortal
              model={performerObjectId}
              users={performersUsersOptions}
              placeholder={t('placeholders.user')}
              variant="outlined-without-active-shadow"
            />
          ) : (
            <DepartmentsSelect
              withinPortal
              model={performerObjectId}
              variant="outlined-without-active-shadow"
              placeholder={t('placeholders.users_group')}
              includeArray={performersDepartmentsIncludeArray}
              departments={departmentsSettingsStore.departments}
            />
          )}
        </AppointmentFormItem>
      )}

      {selectedSchedule && (
        <AppointmentDateAndTimeFormItem
          day={dayValue}
          endTime={endTime}
          startTime={startTime}
          businessHours={businessHours}
          timePeriodModel={timePeriodModel}
          selectedSchedule={selectedSchedule}
        />
      )}

      <AppointmentFormItem label={t('description')} alignItems="flex-start">
        <MyTextArea
          minRows={4}
          maxRows={16}
          model={comment}
          variant="outlined"
          placeholder={t('placeholders.appointment_notes')}
        />
      </AppointmentFormItem>
    </AppointmentBlock>
  );
});

AppointmentVisitParameters.displayName = 'AppointmentVisitParameters';
export { AppointmentVisitParameters };
