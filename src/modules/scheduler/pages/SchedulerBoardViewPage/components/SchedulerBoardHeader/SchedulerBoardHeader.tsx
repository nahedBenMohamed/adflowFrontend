import { appStore, iconStore, userStore } from '@/app';
import { departmentsSettingsStore } from '@/modules/settings';
import {
  AddRoundButton,
  DefaultHeader,
  DepartmentsSelect,
  MyUsersSelect,
  TutorialProductType,
  type DefaultHeaderModuleIconProps,
  type Optional,
  type SelectModel,
  type User,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SchedulePerformerType, type Schedule } from '../../../../shared';

interface Props {
  isScheduleLoading: boolean;
  performerObjectId: SelectModel;
  schedule?: Schedule;
  canAddAppointment?: boolean;
  showAppointmentModal: () => void;
}

const FIXED_DD_WIDTH = 240;

const SchedulerBoardHeader = observer((props: Props) => {
  const {
    isScheduleLoading,
    performerObjectId,
    schedule,
    canAddAppointment,
    showAppointmentModal,
  } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_board_view_page',
  });

  const getUsersByObjectsIds = useCallback((performersObjectsIds: number[]): User[] => {
    return userStore.activeUsers.filter(u => performersObjectsIds.includes(u.id));
  }, []);

  const moduleIconProps = useMemo<Optional<DefaultHeaderModuleIconProps>>(
    () =>
      schedule
        ? {
            icon: iconStore.getByName(schedule.icon).icon,
            color: iconStore.schedulerColor,
          }
        : undefined,
    [schedule]
  );

  return (
    <DefaultHeader
      objectId={schedule?.id}
      moduleName={schedule?.name}
      moduleIconProps={moduleIconProps}
      productType={TutorialProductType.SCHEDULER}
      Controls={
        canAddAppointment && (
          <AddRoundButton
            disabled={isScheduleLoading}
            label={t('create_appointment')}
            onClick={showAppointmentModal}
          />
        )
      }
    >
      {schedule &&
        appStore.isLoaded &&
        (schedule.performersType === SchedulePerformerType.DEPARTMENT ? (
          <DepartmentsSelect
            withinPortal
            model={performerObjectId}
            variant="outlined-secondary"
            fixedDropdownWidth={FIXED_DD_WIDTH}
            includeArray={schedule.perfomersObjectsIds}
            departments={departmentsSettingsStore.departments}
          />
        ) : (
          <MyUsersSelect
            withinPortal
            model={performerObjectId}
            variant="outlined-secondary"
            fixedDropdownWidth={FIXED_DD_WIDTH}
            users={getUsersByObjectsIds(schedule.perfomersObjectsIds)}
          />
        ))}
    </DefaultHeader>
  );
});

SchedulerBoardHeader.displayName = 'SchedulerBoardHeader';
export { SchedulerBoardHeader };
