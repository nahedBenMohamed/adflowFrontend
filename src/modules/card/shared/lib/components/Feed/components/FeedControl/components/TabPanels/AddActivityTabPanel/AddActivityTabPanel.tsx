import { userStore } from '@/app';
import { useGetUserWorkingTimeSlots } from '@/modules/card';
import { activityTypeStore, type CreateActivityDto } from '@/modules/tasks';
import {
  FunctionalTextEditor,
  InputModel,
  MyDatePickerSelect,
  SelectModel,
  TruncateMixin,
  UserPicker,
  UtcDate,
  throttle,
  type Nullable,
  type Time,
  type User,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  useCallback,
  useLayoutEffect,
  useReducer,
  useState,
  type KeyboardEventHandler,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ActivityTypeControl } from '../../../../ActivityTypeControl';
import { TextEditorControls } from '../../../../FeedItem';
import { PlannerBody } from '../../../../PlannerBody/PlannerBody';
import { TimePicker } from '../../../../TimePicker/TimePicker';
import { TextEditorWrapper } from '../TextEditorWrapper/TextEditorWrapper';

const Header = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  padding: 12px 16px 0;

  ${TruncateMixin}
`;

const HeaderElementWrapper = styled.div`
  flex: 1;

  ${TruncateMixin}
`;

interface Props {
  entityId: number;
  currentUser: User;
  addActivity: (dto: CreateActivityDto) => Promise<boolean>;
}

interface InitialForm {
  time: Nullable<Time>;
  date: SelectModel;
  text: InputModel;
  responsibleUser: User;
  activityType: SelectModel;
}

const AddActivityTabPanel = observer((props: Props) => {
  const { entityId, currentUser, addActivity } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.add_activity',
  });

  const [editorKey, rerenderEditor] = useReducer(x => ++x, 0);

  const [isLoading, setIsLoading] = useState(false);
  const [focused, { open: handleFocus, close: handleBlur }] = useDisclosure(false);

  const [datePickerOpened, { open: showDatePicker, close: hideDatePicker }] = useDisclosure(false);

  const form = useLocalObservable<InitialForm>(() => ({
    text: InputModel.create(),
    time: null,
    responsibleUser: currentUser,
    date: SelectModel.create(UtcDate.now().startOfDay()),
    activityType: SelectModel.create(activityTypeStore.firstActivityType?.id),
  }));

  const times = useGetUserWorkingTimeSlots(form.responsibleUser);

  useLayoutEffect(() => {
    if (times?.length && times[0] && !form.time) form.time = times[0];
  }, [form, times]);

  const onSelectResponsibleUser = useCallback(
    (user: User) => {
      form.responsibleUser = user;

      form.time = null;
    },
    [form]
  );

  const onSelectTime = useCallback((time: Time) => (form.time = time), [form]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSave = useCallback(
    throttle(async (): Promise<void> => {
      if (!form.activityType.value || !form.time) return;

      const dto: CreateActivityDto = {
        entityId,
        text: form.text.value,
        responsibleUserId: form.responsibleUser.id,
        activityTypeId: form.activityType.value,
        endDate: form.date.value.addSeconds(form.time.endTime).formatISO(),
        startDate: form.date.value.addSeconds(form.time.startTime).formatISO(),
        fileIds: [],
      };

      try {
        setIsLoading(true);

        const success = await addActivity(dto);

        if (success) {
          form.text.setValue('');
          form.date.setValue(UtcDate.now().startOfDay());
          form.activityType.setValue(activityTypeStore.firstActivityType?.id);

          rerenderEditor();
        }
      } catch (e) {
        throw new Error(`Error while adding activity: ${e}`);
      } finally {
        setIsLoading(false);
        handleBlur();
      }
    }, 1000),
    [form, addActivity]
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    e => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();

        handleSave();
      }
    },
    [handleSave]
  );

  return (
    <>
      <Header>
        <HeaderElementWrapper>
          <ActivityTypeControl
            model={form.activityType}
            activityTypes={activityTypeStore.activeActivityTypes}
          />
        </HeaderElementWrapper>

        <HeaderElementWrapper>
          <UserPicker
            withinPortal
            noActiveShadow
            users={userStore.activeUsers}
            selectedId={form.responsibleUser.id}
            onSelect={onSelectResponsibleUser}
          />
        </HeaderElementWrapper>

        <HeaderElementWrapper>
          <MyDatePickerSelect
            type="default"
            model={form.date}
            titleMinWidth={0}
            opened={datePickerOpened}
            variant="empty-without-arrow"
            hide={hideDatePicker}
            show={showDatePicker}
          />
        </HeaderElementWrapper>

        <HeaderElementWrapper>
          <TimePicker
            selected={form.time}
            times={times ?? []}
            loading={times === null}
            onSelect={onSelectTime}
          />
        </HeaderElementWrapper>
      </Header>

      <PlannerBody>
        <TextEditorWrapper $defaultOutlined $focused={focused}>
          <FunctionalTextEditor
            key={editorKey}
            model={form.text}
            variant="without-border"
            placeholder={t('placeholder')}
            TextEditorControls={
              <TextEditorControls
                saving={isLoading}
                visibleSaveButton={Boolean(form.activityType.value)}
                handleSave={handleSave}
              />
            }
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
          />
        </TextEditorWrapper>
      </PlannerBody>
    </>
  );
});

AddActivityTabPanel.displayName = 'AddActivityTabPanel';
export { AddActivityTabPanel };
