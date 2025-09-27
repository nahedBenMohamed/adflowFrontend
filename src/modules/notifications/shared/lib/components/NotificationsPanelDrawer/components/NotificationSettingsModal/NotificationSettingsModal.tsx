import { userStore } from '@/app';
import {
  BooleanModel,
  DelaySelect,
  DialogModalSecondary,
  MultiselectModel,
  MySwitch,
  MySwitchWithModel,
  SpanWithEllipsis,
  UsersMultiselect,
  type Nullable,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { NotificationSettingsDto } from '../../../../../../api';
import { NotificationsSettingsStore } from '../../../../../../store';
import { getSettingTitleByType } from '../../../../helpers';
import { useGetNotificationsDelayOptions } from '../../../../hooks';
import { NotificationType, type NotificationTypeSettings } from '../../../../models';
import { NotificationsSettingsModalSkeleton } from '../NotificationsSettingsModalSkeleton/NotificationsSettingsModalSkeleton';
import { NotificationModalDelimiter, NotificationTypeBlock } from './components';

const MultiselectWrapper = styled.div`
  width: 45%;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px 32px;
`;

interface Props {
  opened: boolean;
  onClose: () => void;
}

interface InitialForm {
  enablePopup: BooleanModel;
  taskNew: BooleanModel;
  taskOverdue: BooleanModel;
  taskBeforeStart: Nullable<number>;
  taskOverdueEmployee: MultiselectModel<number>;
  activityNew: BooleanModel;
  activityOverdue: BooleanModel;
  activityBeforeStart: Nullable<number>;
  activityOverdueEmployee: MultiselectModel<number>;
}

const taskGroup: NotificationType[] = [
  NotificationType.TASK_NEW,
  NotificationType.TASK_OVERDUE,
  NotificationType.TASK_BEFORE_START,
  NotificationType.TASK_OVERDUE_EMPLOYEE,
];

const activityGroup: NotificationType[] = [
  NotificationType.ACTIVITY_NEW,
  NotificationType.ACTIVITY_OVERDUE,
  NotificationType.ACTIVITY_BEFORE_START,
  NotificationType.ACTIVITY_OVERDUE_EMPLOYEE,
];

const NotificationSettingsModal = observer((props: Props) => {
  const { opened, onClose } = props;

  const { t } = useTranslation('module.notifications', {
    keyPrefix: 'notifications.components.notifications_panel.ui.notification_settings_modal',
  });

  const notificationsSettingsStore = useMemo(() => new NotificationsSettingsStore(), []);

  const {
    isLoading,
    isUpdating,
    notificationSettings,
    loadNotificationSettings,
    updateNotificationSettings,
  } = notificationsSettingsStore;

  const form = useLocalObservable<InitialForm>(() => ({
    enablePopup: BooleanModel.create(true),
    // task group
    taskNew: BooleanModel.create(true),
    taskOverdue: BooleanModel.create(true),
    taskBeforeStart: null,
    taskOverdueEmployee: MultiselectModel.create<number>([]),
    // activity group
    activityNew: BooleanModel.create(true),
    activityOverdue: BooleanModel.create(true),
    activityBeforeStart: null,
    activityOverdueEmployee: MultiselectModel.create<number>([]),
  }));

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const settings = await loadNotificationSettings();

      if (!settings) return;

      form.enablePopup.value = settings.enablePopup;

      // task group
      const taskNewType = settings.types.find(t => t.type === NotificationType.TASK_NEW);
      if (taskNewType) form.taskNew.value = taskNewType.isEnabled;

      const taskOverdueType = settings.types.find(t => t.type === NotificationType.TASK_OVERDUE);
      if (taskOverdueType) form.taskOverdue.value = taskOverdueType.isEnabled;

      const taskBeforeStartType = settings.types.find(
        t => t.type === NotificationType.TASK_BEFORE_START
      );
      if (taskBeforeStartType) form.taskBeforeStart = taskBeforeStartType.before;

      const taskOverdueEmployeeType = settings.types.find(
        t => t.type === NotificationType.TASK_OVERDUE_EMPLOYEE
      );
      if (taskOverdueEmployeeType)
        form.taskOverdueEmployee.values = taskOverdueEmployeeType.followUserIds ?? [];

      // activity group
      const activityNewType = settings.types.find(t => t.type === NotificationType.ACTIVITY_NEW);
      if (activityNewType) form.activityNew.value = activityNewType.isEnabled;

      const activityOverdueType = settings.types.find(
        t => t.type === NotificationType.ACTIVITY_OVERDUE
      );
      if (activityOverdueType) form.activityOverdue.value = activityOverdueType.isEnabled;

      const activityBeforeStartType = settings.types.find(
        t => t.type === NotificationType.ACTIVITY_BEFORE_START
      );
      if (activityBeforeStartType) form.activityBeforeStart = activityBeforeStartType.before;

      const activityOverdueEmployeeType = settings.types.find(
        t => t.type === NotificationType.ACTIVITY_OVERDUE_EMPLOYEE
      );
      if (activityOverdueEmployeeType)
        form.activityOverdueEmployee.values = activityOverdueEmployeeType.followUserIds ?? [];
    };

    loadData();
  }, [form, loadNotificationSettings]);

  const delayOptions = useGetNotificationsDelayOptions();

  useEffect(() => {
    if (!notificationSettings) return;
  }, [notificationSettings]);

  const handleUpdateSettings = async (): Promise<void> => {
    if (!notificationSettings) return;

    const settings: NotificationSettingsDto = {
      enablePopup: form.enablePopup.value,
      types: [
        ...notificationSettings.types.filter(
          t => !taskGroup.includes(t.type) && !activityGroup.includes(t.type)
        ),
        // task group
        {
          type: NotificationType.TASK_NEW,
          isEnabled: form.taskNew.value,
          before: null,
          followUserIds: null,
          objectId: null,
        },
        {
          type: NotificationType.TASK_OVERDUE,
          isEnabled: form.taskOverdue.value,
          before: null,
          followUserIds: null,
          objectId: null,
        },
        {
          type: NotificationType.TASK_BEFORE_START,
          isEnabled: form.taskBeforeStart !== null,
          before: form.taskBeforeStart as number,
          followUserIds: null,
          objectId: null,
        },
        {
          type: NotificationType.TASK_OVERDUE_EMPLOYEE,
          isEnabled: form.taskOverdueEmployee.values.length > 0,
          before: null,
          followUserIds: form.taskOverdueEmployee.values,
          objectId: null,
        },
        // activity group
        {
          type: NotificationType.ACTIVITY_NEW,
          isEnabled: form.activityNew.value,
          before: null,
          followUserIds: null,
          objectId: null,
        },
        {
          type: NotificationType.ACTIVITY_OVERDUE,
          isEnabled: form.activityOverdue.value,
          before: null,
          followUserIds: null,
          objectId: null,
        },
        {
          type: NotificationType.ACTIVITY_BEFORE_START,
          isEnabled: form.activityBeforeStart !== null,
          before: form.activityBeforeStart as number,
          followUserIds: null,
          objectId: null,
        },
        {
          type: NotificationType.ACTIVITY_OVERDUE_EMPLOYEE,
          isEnabled: form.activityOverdueEmployee.values.length > 0,
          before: null,
          followUserIds: form.activityOverdueEmployee.values,
          objectId: null,
        },
      ],
    };

    await updateNotificationSettings(settings);
  };

  const onApprove = async (): Promise<void> => {
    await handleUpdateSettings();
    onClose();
  };

  const handleCheck = (type: NotificationTypeSettings) => {
    type.isEnabled = !type.isEnabled;
  };

  return (
    <DialogModalSecondary
      width="500px"
      maxHeight="528px"
      isOpened={opened}
      Header={t('title')}
      loading={isUpdating}
      approveDisabled={isUpdating}
      onClose={onClose}
      onApprove={onApprove}
    >
      <Root>
        {isLoading ? (
          <NotificationsSettingsModalSkeleton />
        ) : (
          <>
            <NotificationTypeBlock>
              <SpanWithEllipsis text={t('enable_popup')} />
              <MySwitchWithModel model={form.enablePopup} />
            </NotificationTypeBlock>

            <NotificationModalDelimiter />

            <NotificationTypeBlock>
              <SpanWithEllipsis text={t('new_task')} />
              <MySwitchWithModel model={form.taskNew} />
            </NotificationTypeBlock>

            <NotificationTypeBlock>
              <SpanWithEllipsis text={t('overdue_task')} />
              <MySwitchWithModel model={form.taskOverdue} />
            </NotificationTypeBlock>

            <NotificationTypeBlock>
              <SpanWithEllipsis text={t('before_task_start')} />
              <DelaySelect
                options={delayOptions}
                dropdownFixedWidth={408}
                delay={form.taskBeforeStart}
                onChange={delay => (form.taskBeforeStart = delay)}
              />
            </NotificationTypeBlock>

            <NotificationTypeBlock>
              <SpanWithEllipsis text={t('overdue_task_employee')} />

              <MultiselectWrapper>
                <UsersMultiselect
                  withinPortal
                  variant="outlined"
                  fixedDropdownWidth={264}
                  model={form.taskOverdueEmployee}
                  users={userStore.activeUsers}
                  placeholder={t('placeholders.select')}
                />
              </MultiselectWrapper>
            </NotificationTypeBlock>

            <NotificationModalDelimiter />

            <NotificationTypeBlock>
              <SpanWithEllipsis text={t('new_activity')} />
              <MySwitchWithModel model={form.activityNew} />
            </NotificationTypeBlock>

            <NotificationTypeBlock>
              <SpanWithEllipsis text={t('overdue_activity')} />
              <MySwitchWithModel model={form.activityOverdue} />
            </NotificationTypeBlock>

            <NotificationTypeBlock>
              <SpanWithEllipsis text={t('before_activity_start')} />
              <DelaySelect
                options={delayOptions}
                dropdownFixedWidth={408}
                delay={form.activityBeforeStart}
                onChange={delay => (form.activityBeforeStart = delay)}
              />
            </NotificationTypeBlock>

            <NotificationTypeBlock>
              <SpanWithEllipsis text={t('overdue_activity_employee')} />

              <MultiselectWrapper>
                <UsersMultiselect
                  withinPortal
                  variant="outlined"
                  fixedDropdownWidth={264}
                  users={userStore.activeUsers}
                  model={form.activityOverdueEmployee}
                  placeholder={t('placeholders.select')}
                />
              </MultiselectWrapper>
            </NotificationTypeBlock>

            <NotificationModalDelimiter />

            {notificationSettings &&
              notificationSettings.types
                .filter(nt => !activityGroup.includes(nt.type) && !taskGroup.includes(nt.type))
                .map((type, idx) => (
                  <NotificationTypeBlock key={idx}>
                    <SpanWithEllipsis text={getSettingTitleByType({ typeSettings: type, t })} />

                    <MySwitch checked={type.isEnabled} onChange={() => handleCheck(type)} />
                  </NotificationTypeBlock>
                ))}
          </>
        )}
      </Root>
    </DialogModalSecondary>
  );
});

NotificationSettingsModal.displayName = 'NotificationSettingsModal';
export { NotificationSettingsModal };
