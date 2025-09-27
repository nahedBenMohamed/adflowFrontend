import { userStore } from '@/app';
import { SchedulePerformerType, type Schedule } from '@/modules/scheduler';
import { DepartmentsSelect, MyUsersSelect, type Optional } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarType,
  type GoogleCalendarConnectModalInitialForm,
} from '../../../../../../../../../shared';
import { departmentsSettingsStore } from '../../../../../../../../../store';
import { IntegrationFormGroup } from '../../../../../../IntegrationFormGroup/IntegrationFormGroup';

interface Props {
  form: GoogleCalendarConnectModalInitialForm;
  schedules?: Schedule[];
}

const GoogleCalendarResponsibleFormGroup = observer((props: Props) => {
  const { form, schedules } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.google_calendar.google_calendar_connect_modal',
  });

  const { activeUsers } = userStore;

  const schedule = useMemo<Optional<Schedule>>(() => {
    if (!schedules) return;

    return schedules.find(s => s.id === form.scheduleId.value);
  }, [form.scheduleId.value, schedules]);

  return (
    <IntegrationFormGroup label={t('responsible_user')}>
      {form.calendarTypeRadio.value === CalendarType.TASK && form.taskBoardId.value && (
        <MyUsersSelect
          withinPortal
          users={activeUsers}
          model={form.responsibleUserId}
          variant="outlined-without-active-shadow"
        />
      )}

      {schedule &&
        form.calendarTypeRadio.value === CalendarType.SCHEDULE &&
        (schedule.performersType === SchedulePerformerType.USER ? (
          <MyUsersSelect
            withinPortal
            model={form.responsibleUserId}
            variant="outlined-without-active-shadow"
            users={activeUsers.filter(u => schedule.perfomersObjectsIds.includes(u.id))}
          />
        ) : (
          <DepartmentsSelect
            withinPortal
            model={form.responsibleUserId}
            variant="outlined-without-active-shadow"
            departments={departmentsSettingsStore.departments.filter(d =>
              schedule.perfomersObjectsIds.includes(d.id)
            )}
          />
        ))}
    </IntegrationFormGroup>
  );
});

GoogleCalendarResponsibleFormGroup.displayName = 'GoogleCalendarResponsibleFormGroup';
export { GoogleCalendarResponsibleFormGroup };
