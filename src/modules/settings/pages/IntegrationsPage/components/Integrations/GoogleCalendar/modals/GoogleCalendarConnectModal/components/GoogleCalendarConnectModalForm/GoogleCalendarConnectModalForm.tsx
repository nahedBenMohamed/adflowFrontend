import { type Schedule } from '@/modules/scheduler';
import {
  DefaultLoader,
  envUtil,
  MyCheckboxWithBooleanModel,
  MyInput,
  MySelect,
  type Board,
  type Nullable,
  type Option,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  CalendarType,
  type CalendarAccess,
  type GoogleCalendar,
  type GoogleCalendarConnectModalInitialForm,
} from '../../../../../../../../../shared';
import { IntegrationFormGroup } from '../../../../../../IntegrationFormGroup/IntegrationFormGroup';
import { IntegrationInfoText } from '../../../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import { IntegrationRadioItem } from '../../../../../../IntegrationRadioItem/IntegrationRadioItem';
import { GoogleCalendarLinkedItemsGroup } from '../GoogleCalendarLinkedItemsGroup/GoogleCalendarLinkedItemsGroup';
import { GoogleCalendarResponsibleFormGroup } from '../GoogleCalendarResponsibleFormGroup/GoogleCalendarResponsibleFormGroup';

export const Delimiter = styled.hr`
  width: 100%;

  border-top: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  loading: boolean;
  calendarAccess: Nullable<CalendarAccess>;
  currentCalendar: Nullable<GoogleCalendar>;
  form: GoogleCalendarConnectModalInitialForm;
  schedules?: Schedule[];
  tasksBoards?: Board[];
}

const GoogleCalendarConnectModalForm = observer((props: Props) => {
  const { loading, calendarAccess, currentCalendar, form, schedules, tasksBoards } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.google_calendar.google_calendar_connect_modal',
  });

  const calendarOptions = useMemo<Option<string>[]>(
    () =>
      calendarAccess?.calendarInfos.map(i => ({
        value: i.id,
        label: i.title,
      })) ?? [],
    [calendarAccess?.calendarInfos]
  );

  const tasksBoardOptions = useMemo<Option<number>[]>(
    () =>
      (tasksBoards ?? []).map(b => ({
        value: b.id,
        label: b.name,
      })),
    [tasksBoards]
  );

  const schedulesOptions = useMemo<Option<number>[]>(
    () =>
      (schedules ?? []).map(s => ({
        value: s.id,
        label: s.name,
      })),
    [schedules]
  );

  const handleChangeCalendar = useCallback(
    (externalId: string) => {
      if (!calendarAccess) return;

      const calendarInfo = calendarAccess?.calendarInfos.find(i => i.id === externalId);

      if (calendarInfo) form.title.setValue(calendarInfo.title);
    },
    [calendarAccess, form]
  );

  const handleChangeTaskBoardOrScheduleRadio = useCallback(
    (value: string) => {
      if (value === CalendarType.TASK) {
        form.taskBoardId.setValue(tasksBoards?.[0]?.id);

        form.scheduleId.setValue(null);
        form.scheduleId.clearError();
      } else {
        form.scheduleId.setValue(schedules?.[0]?.id);

        form.taskBoardId.setValue(null);
        form.taskBoardId.clearError();
      }

      form.responsibleUserId.setValue(null);
      form.responsibleUserId.clearError();

      form.linkedIds.clear();
    },
    [form, schedules, tasksBoards]
  );

  return loading ? (
    <DefaultLoader height="200px" />
  ) : (
    <>
      <IntegrationInfoTitle>{t('connect_calendar')}</IntegrationInfoTitle>
      <IntegrationInfoText>{t('finish_integration_annotation')}</IntegrationInfoText>

      {currentCalendar && (
        <IntegrationFormGroup
          label={t('integration_name')}
          hint={t('integration_name_readonly_hint')}
        >
          <MyInput
            disabled
            variant="outlined"
            model={form.title}
            placeholder={t('placeholders.integration_name')}
          />
        </IntegrationFormGroup>
      )}

      {calendarAccess && (
        <IntegrationFormGroup label={t('calendar')} hint={t('calendar_hint')}>
          <MySelect
            withinPortal
            model={form.externalId}
            options={calendarOptions}
            variant="outlined-without-active-shadow"
            handleChange={handleChangeCalendar}
          />
        </IntegrationFormGroup>
      )}

      {!schedules || schedules.length === 0 ? (
        <IntegrationFormGroup label={t('task_board')}>
          <MySelect
            withinPortal
            model={form.taskBoardId}
            options={tasksBoardOptions}
            variant="outlined-without-active-shadow"
          />
        </IntegrationFormGroup>
      ) : (
        <>
          <IntegrationRadioItem
            label={t('schedule', { company: envUtil.appName })}
            value={CalendarType.SCHEDULE}
            model={form.calendarTypeRadio}
            onChange={handleChangeTaskBoardOrScheduleRadio}
          >
            <MySelect
              withinPortal
              model={form.scheduleId}
              options={schedulesOptions}
              variant="outlined-without-active-shadow"
            />
          </IntegrationRadioItem>

          <IntegrationRadioItem
            label={t('task_board')}
            model={form.calendarTypeRadio}
            value={CalendarType.TASK}
            onChange={handleChangeTaskBoardOrScheduleRadio}
          >
            <MySelect
              withinPortal
              model={form.taskBoardId}
              options={tasksBoardOptions}
              variant="outlined-without-active-shadow"
            />
          </IntegrationRadioItem>
        </>
      )}

      <GoogleCalendarResponsibleFormGroup form={form} schedules={schedules} />

      {!currentCalendar && (
        <IntegrationFormGroup label={t('sync_events')}>
          <MyCheckboxWithBooleanModel model={form.syncEvents} />
        </IntegrationFormGroup>
      )}

      <Delimiter />

      <GoogleCalendarLinkedItemsGroup
        form={form}
        schedulesOptions={schedulesOptions}
        tasksBoardOptions={tasksBoardOptions}
      />
    </>
  );
});

GoogleCalendarConnectModalForm.displayName = 'GoogleCalendarConnectModalForm';
export { GoogleCalendarConnectModalForm };
