import { boardApiUtil } from '@/app';
import { SchedulePerformerType, useGetSchedules } from '@/modules/scheduler';
import {
  BooleanModel,
  ConnectGoogleButton,
  DefaultLoader,
  InputModel,
  type ModalControl,
  MultiselectModel,
  type Nullable,
  type Optional,
  SelectModel,
  validateForm,
} from '@/shared';
import { useLocalObservable } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  CreateGoogleCalendarDto,
  googleCalendarIntegrationApi,
  type GoogleCalendarLinkedDto,
  invalidateGoogleCalendarIntegrationsInCache,
  UpdateGoogleCalendarDto,
} from '../../../../../../../api';
import {
  type CalendarAccess,
  CalendarLinkedProcessRadio,
  CalendarType,
  GOOGLE_CALENDAR_CONNECT_MODAL_QUERY_PARAM,
  GOOGLE_CODE_PARAM_KEY,
  GOOGLE_STATE_PARAM_KEY,
  type GoogleCalendar,
  type GoogleCalendarConnectModalInitialForm,
} from '../../../../../../../shared';
import { IntegrationInfoFeatureList } from '../../../../IntegrationInfoFeatureList/IntegrationInfoFeatureList';
import { IntegrationInfoText } from '../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import { GoogleCalendarModalTemplate } from '../GoogleCalendarModalTemplate/GoogleCalendarModalTemplate';
import { GoogleCalendarConnectModalForm } from './components';

const ConnectGoogleButtonWrapper = styled.div`
  width: 40%;
  min-width: fit-content;
  max-width: 100%;
`;

interface Props {
  control: ModalControl;
  currentCalendar: Nullable<GoogleCalendar>;
  handleClearCurrentCalendar: () => void;
}

const GoogleCalendarConnectModal = (props: Props) => {
  const { control, currentCalendar, handleClearCurrentCalendar } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.google_calendar.google_calendar_connect_modal',
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const code = searchParams.get(GOOGLE_CODE_PARAM_KEY);
  const state = searchParams.get(GOOGLE_STATE_PARAM_KEY) || undefined;

  const [calendarAccess, setCalendarAccess] = useState<Nullable<CalendarAccess>>(null);
  const [calendarAccessError, setCalendarAccessError] = useState<Nullable<string>>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: schedules, isLoading: areSchedulesLoading } = useGetSchedules();
  const { data: tasksBoards, isLoading: areTasksBoardsLoading } = boardApiUtil.useGetTasksBoards();

  const responsibleObjectId = useMemo<Optional<number>>(() => {
    if (!currentCalendar) return undefined;

    if (currentCalendar.type === CalendarType.TASK) {
      return currentCalendar.responsibleId;
    } else {
      const schedule = schedules?.find(s => s.id === currentCalendar.objectId);

      if (!schedule) return undefined;

      if (schedule.performersType === SchedulePerformerType.USER) {
        return (
          schedule.performers.find(
            p => p.type === SchedulePerformerType.USER && p.id === currentCalendar.responsibleId
          )?.userId ?? undefined
        );
      } else if (schedule.performersType === SchedulePerformerType.DEPARTMENT) {
        return (
          schedule.performers.find(
            p =>
              p.type === SchedulePerformerType.DEPARTMENT && p.id === currentCalendar.responsibleId
          )?.departmentId ?? undefined
        );
      }
    }
  }, [currentCalendar, schedules]);

  const form = useLocalObservable<GoogleCalendarConnectModalInitialForm>(() => ({
    title: InputModel.create(currentCalendar?.title).required(),
    externalId: SelectModel.create(currentCalendar?.externalId).required(),
    taskBoardId: SelectModel.create(
      currentCalendar?.type === CalendarType.TASK ? currentCalendar?.objectId : tasksBoards?.[0]?.id
    ),
    scheduleId: SelectModel.create(
      currentCalendar?.type === CalendarType.SCHEDULE
        ? currentCalendar?.objectId
        : schedules?.[0]?.id
    ),
    calendarTypeRadio: InputModel.create(currentCalendar?.type ?? CalendarType.TASK).required(),
    responsibleUserId: SelectModel.create(responsibleObjectId).required(),
    linkedIds: MultiselectModel.create<number>(
      currentCalendar?.linked?.map<number>(i => i.objectId)
    ),
    processAll: InputModel.create(
      String(
        currentCalendar?.linked && currentCalendar.linked.length > 0
          ? CalendarLinkedProcessRadio.SELECT_SOME
          : currentCalendar?.processAll
            ? CalendarLinkedProcessRadio.SELECT_ALL
            : CalendarLinkedProcessRadio.DO_NOT_SELECT
      )
    ).required(),
    syncEvents: BooleanModel.create(true),
  }));

  // form async data initialization
  useLayoutEffect(() => {
    if (calendarAccess) {
      const primaryCalendarInfo = calendarAccess?.calendarInfos.find(i => i.primary);

      if (primaryCalendarInfo) {
        form.title.setValue(primaryCalendarInfo.title);
        form.externalId.setValue(primaryCalendarInfo.id);
      }
    }

    if (!form.scheduleId.value && schedules) form.scheduleId.setValue(schedules[0]?.id);

    if (!form.taskBoardId.value && tasksBoards) form.taskBoardId.setValue(tasksBoards[0]?.id);
  }, [calendarAccess, form, schedules, tasksBoards]);

  useLayoutEffect(() => {
    const handleLoadCalendarAccess = async () => {
      if (code) {
        try {
          setCalendarAccessError(null);

          const access = await googleCalendarIntegrationApi.processCode({ code, state });

          setCalendarAccess(access);
        } catch (e) {
          setCalendarAccessError(t('error_message'));

          throw new Error(
            `Failed to process Google Calendar code ${JSON.stringify({ code, state })}: ${JSON.stringify(e)}`
          );
        }
      }
    };

    handleLoadCalendarAccess();
  }, [code, state, t]);

  const handleGoogleConnect = useCallback(async (): Promise<void> => {
    try {
      setIsConnecting(true);

      const url = await googleCalendarIntegrationApi.authorizeUrl();

      window.location.href = url;
    } catch (e) {
      throw new Error(`Failed to get Google authorization url: ${JSON.stringify(e)}`);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    control.close();
    handleClearCurrentCalendar();

    setSearchParams(prev => {
      prev.delete(GOOGLE_CODE_PARAM_KEY);
      prev.delete(GOOGLE_STATE_PARAM_KEY);
      prev.delete(GOOGLE_CALENDAR_CONNECT_MODAL_QUERY_PARAM);

      return prev;
    });
  }, [control, setSearchParams, handleClearCurrentCalendar]);

  const handleApprove = useCallback(async (): Promise<void> => {
    if (!validateForm(form)) return;

    const calendarType = form.calendarTypeRadio.value as CalendarType;
    const calendarInfo = calendarAccess?.calendarInfos.find(i => i.id === form.externalId.value);

    const isTaskCalendarType = form.calendarTypeRadio.value === CalendarType.TASK;
    const isScheduleCalendarType = form.calendarTypeRadio.value === CalendarType.SCHEDULE;

    const isProcessAll = form.processAll.value === CalendarLinkedProcessRadio.SELECT_ALL;
    const isNotProcessAll = form.processAll.value === CalendarLinkedProcessRadio.DO_NOT_SELECT;

    if (isTaskCalendarType && !form.taskBoardId.required().validate()) return;

    if (isScheduleCalendarType && !form.scheduleId.required().validate()) return;

    let responsibleId: Optional<number>;

    if (isTaskCalendarType) {
      responsibleId = form.responsibleUserId.value;
    } else {
      const schedule = schedules?.find(s => s.id === form.scheduleId.value);

      if (!schedule) throw new Error(`Failed to find schedule with id ${form.scheduleId.value}`);

      if (schedule.performersType === SchedulePerformerType.USER) {
        responsibleId =
          schedule.performers.find(
            p => p.type === SchedulePerformerType.USER && p.userId === form.responsibleUserId.value
          )?.id ?? undefined;
      } else if (schedule.performersType === SchedulePerformerType.DEPARTMENT) {
        responsibleId =
          schedule.performers.find(
            p =>
              p.type === SchedulePerformerType.DEPARTMENT &&
              p.departmentId === form.responsibleUserId.value
          )?.id ?? undefined;
      }
    }

    if (!responsibleId)
      throw new Error('Failed to calculate responsible user id when parsing form data');

    try {
      setIsSaving(true);

      if (currentCalendar) {
        const dto = new UpdateGoogleCalendarDto({
          responsibleId,
          type: calendarType,
          title: form.title.trimmedValue,
          readonly: calendarInfo?.readonly,
          externalId: form.externalId.value,
          processAll: isProcessAll ? true : isNotProcessAll ? false : undefined,
          objectId: isTaskCalendarType ? form.taskBoardId.value : form.scheduleId.value,
          linked:
            isProcessAll || isNotProcessAll
              ? []
              : form.linkedIds.values.map<GoogleCalendarLinkedDto>(id => ({
                  objectId: id,
                  type: calendarType,
                })),
        });

        await googleCalendarIntegrationApi.updateGoogleCalendarIntegration({
          calendarId: currentCalendar.id,
          dto,
        });
      } else if (calendarAccess && calendarInfo) {
        const dto = new CreateGoogleCalendarDto({
          responsibleId,
          type: calendarType,
          token: calendarAccess.token,
          title: form.title.trimmedValue,
          readonly: calendarInfo?.readonly,
          externalId: form.externalId.value,
          processAll: isProcessAll ? true : isNotProcessAll ? false : undefined,
          objectId: isTaskCalendarType ? form.taskBoardId.value : form.scheduleId.value,
          syncEvents: form.syncEvents.value,
          linked:
            isProcessAll || isNotProcessAll
              ? []
              : form.linkedIds.values.map<GoogleCalendarLinkedDto>(id => ({
                  objectId: id,
                  type: calendarType,
                })),
        });

        await googleCalendarIntegrationApi.createGoogleCalendarIntegration(dto);
      }
    } catch (e) {
      throw new Error(
        `Failed to ${currentCalendar ? 'update' : 'create'} Google Calendar integration: ${JSON.stringify(e)}`
      );
    } finally {
      setIsSaving(false);
    }

    invalidateGoogleCalendarIntegrationsInCache();
    handleClose();
  }, [form, calendarAccess, currentCalendar, schedules, handleClose]);

  return (
    <GoogleCalendarModalTemplate
      loading={isSaving}
      opened={control.opened}
      approveTitle={t('save')}
      errorMessage={calendarAccessError}
      hideApprove={!calendarAccess && !currentCalendar}
      maxHeight={
        currentCalendar
          ? '640px'
          : calendarAccess
            ? undefined
            : calendarAccessError
              ? '420px'
              : '364px'
      }
      hide={handleClose}
      onApprove={handleApprove}
    >
      {(!code || calendarAccessError) && !calendarAccess && !currentCalendar && (
        <>
          <IntegrationInfoTitle>{t('title')}</IntegrationInfoTitle>
          <IntegrationInfoFeatureList features={[t('feature')]} />
          <IntegrationInfoText $gray>{t('annotation')}</IntegrationInfoText>
          <ConnectGoogleButtonWrapper>
            <ConnectGoogleButton disabled={isConnecting} onClick={handleGoogleConnect} />
          </ConnectGoogleButtonWrapper>
        </>
      )}

      {code && !calendarAccess && !calendarAccessError ? (
        <DefaultLoader height="200px" />
      ) : (
        (calendarAccess || currentCalendar) && (
          <GoogleCalendarConnectModalForm
            form={form}
            schedules={schedules}
            tasksBoards={tasksBoards}
            calendarAccess={calendarAccess}
            currentCalendar={currentCalendar}
            loading={areSchedulesLoading || areTasksBoardsLoading}
          />
        )
      )}
    </GoogleCalendarModalTemplate>
  );
};

export { GoogleCalendarConnectModal };
