import { MultiselectWithCheckboxes, type Option } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarLinkedProcessRadio,
  CalendarType,
  type GoogleCalendarConnectModalInitialForm,
} from '../../../../../../../../../shared';
import { IntegrationInfoText } from '../../../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationRadioItem } from '../../../../../../IntegrationRadioItem/IntegrationRadioItem';

interface Props {
  schedulesOptions: Option<number>[];
  tasksBoardOptions: Option<number>[];
  form: GoogleCalendarConnectModalInitialForm;
}

const GoogleCalendarLinkedItemsGroup = observer((props: Props) => {
  const { tasksBoardOptions, schedulesOptions, form } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.google_calendar.google_calendar_connect_modal',
  });

  const options =
    form.calendarTypeRadio.value === CalendarType.TASK
      ? tasksBoardOptions.filter(o => o.value !== form.taskBoardId.value)
      : schedulesOptions.filter(o => o.value !== form.scheduleId.value);

  const isTaskCalendarType =
    form.calendarTypeRadio.value === CalendarType.TASK && form.taskBoardId.value;

  const isScheduleCalendarType =
    form.calendarTypeRadio.value === CalendarType.SCHEDULE && form.scheduleId.value;

  const Multiselect = useMemo<ReactNode>(
    () => (
      <MultiselectWithCheckboxes
        withinPortal
        options={options}
        model={form.linkedIds}
        variant="outlined-without-active-shadow"
        placeholder={
          isScheduleCalendarType
            ? t('placeholders.schedules')
            : isTaskCalendarType
              ? t('placeholders.task_boards')
              : undefined
        }
      />
    ),
    [options, form.linkedIds, isScheduleCalendarType, isTaskCalendarType, t]
  );

  return (
    <>
      <IntegrationInfoText>
        {isTaskCalendarType && t('linked_task_boards_annotation')}

        {isScheduleCalendarType && t('linked_schedules_annotation')}
      </IntegrationInfoText>

      {(isTaskCalendarType || isScheduleCalendarType) && (
        <>
          <IntegrationRadioItem
            label={t('do_not_select')}
            model={form.processAll}
            value={CalendarLinkedProcessRadio.DO_NOT_SELECT}
          />

          <IntegrationRadioItem
            label={t('select_all')}
            model={form.processAll}
            value={CalendarLinkedProcessRadio.SELECT_ALL}
          />
        </>
      )}

      {isTaskCalendarType && (
        <IntegrationRadioItem
          model={form.processAll}
          label={t('additional_task_boards')}
          value={CalendarLinkedProcessRadio.SELECT_SOME}
        >
          {Multiselect}
        </IntegrationRadioItem>
      )}

      {isScheduleCalendarType && (
        <IntegrationRadioItem
          value={CalendarLinkedProcessRadio.SELECT_SOME}
          model={form.processAll}
          label={t('additional_schedules')}
        >
          {Multiselect}
        </IntegrationRadioItem>
      )}
    </>
  );
});

GoogleCalendarLinkedItemsGroup.displayName = 'GoogleCalendarLinkedItemsGroup';
export { GoogleCalendarLinkedItemsGroup };
