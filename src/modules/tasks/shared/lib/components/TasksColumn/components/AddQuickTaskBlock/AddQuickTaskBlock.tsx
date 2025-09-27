import { userStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  InputModel,
  MyDatePickerWithTime,
  MyTextArea,
  PlannedTimePicker,
  SelectModel,
  UserPicker,
  UtcDate,
  type Nullable,
  type StageCode,
  type User,
  type UtcDateValue,
} from '@/shared';
import { useWindowEvent } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { RefObject, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import type { CreateTaskDto } from '../../../../../../api';
import { DeadlineType } from '../../../../models';

const Root = styled.div`
  width: 255px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 8px;
  margin-bottom: 8px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;

  &:nth-last-child(2) {
    margin-bottom: 0;
  }
`;

const Form = styled.form<{ $datesShown: boolean }>`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: ${p => (p.$datesShown ? 16 : 20)}px;
`;

const DatesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Date = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  color: var(--button-text-graphite-secondary-text);
`;

const PickersWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

interface InitialForm {
  title: InputModel;
  endDate: SelectModel;
  responsibleUser: User;
  startDate: SelectModel;
  plannedTime: Nullable<number>;
}

interface Props {
  id: number;
  loading: boolean;
  entityId: Nullable<number>;
  groupCode: Nullable<DeadlineType | StageCode>;
  onTaskAdd: (dto: CreateTaskDto) => Promise<void>;
  hide: () => void;
}

export const ADD_QUICK_TASK_CONTROL_CLASS = 'workspace__AddQuickTask--PlusIconWrapper';

const AddQuickTaskBlock = observer((props: Props) => {
  const { id, groupCode, loading, entityId, onTaskAdd, hide } = props;

  const { t } = useTranslation();

  const rootRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { user: currentUser } = authStore;

  if (!currentUser)
    throw new Error(
      `Failed to render AddQuickTaskBlock, current user is not initialized, received: ${currentUser}`
    );

  const form = useLocalObservable<InitialForm>(() => ({
    plannedTime: null,
    responsibleUser: currentUser,
    endDate: SelectModel.create(),
    startDate: SelectModel.create(),
    title: InputModel.create().required(),
  }));

  const [startDateDisabled, setStartDateDisabled] = useState(false);
  const [endDateDisabled, setEndDateDisabled] = useState(false);

  const initDates = useCallback(() => {
    switch (groupCode) {
      case DeadlineType.TODAY: {
        form.startDate.setValue(UtcDate.startOfCurrentDay().setHours(8));
        form.endDate.setValue(UtcDate.endOfCurrentDay());

        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setEndDateDisabled(true);
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setStartDateDisabled(true);

        break;
      }

      case DeadlineType.TOMORROW: {
        form.startDate.setValue(UtcDate.startOfNextDay().setHours(8));
        form.endDate.setValue(UtcDate.endOfNextDay());

        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setStartDateDisabled(true);

        break;
      }

      case DeadlineType.UPCOMING: {
        form.startDate.setValue(UtcDate.startOfNextDay().addDays(1).setHours(8));
        form.endDate.setValue(UtcDate.endOfNextDay().addDays(1));

        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setStartDateDisabled(true);

        break;
      }
    }
  }, [groupCode, form]);

  const [timePickerKey, rerenderTimePicker] = useReducer(x => ++x, 0);

  useEffect(() => {
    initDates();
  }, [groupCode, initDates]);

  async function handleAdd(onClickOutside = false): Promise<void> {
    const { title, responsibleUser, plannedTime } = form;

    const clearForm = () => {
      if (!currentUser)
        throw new Error(
          `Failed to render AddQuickTaskBlock, current user is not initialized, received: ${currentUser}`
        );

      form.title = InputModel.create().required();
      form.endDate = SelectModel.create();
      form.startDate = SelectModel.create();
      form.responsibleUser = currentUser;
    };

    if (onClickOutside && title.value.length === 0) {
      clearForm();

      initDates();
      hide();

      return;
    }

    if (!title.validate()) return;

    const startDate = form.startDate.value as UtcDateValue;
    const endDate = form.endDate.value as UtcDateValue;

    if (form.startDate.value && endDate && endDate.isBeforeOrEqual(form.startDate.value))
      form.startDate.setValue(endDate.startOfDay());

    const dto: CreateTaskDto = {
      entityId,
      text: '',
      fileIds: [],
      subtasks: [],
      stageId: null,
      boardId: null,
      settingsId: null,
      title: title.trimmedValue,
      endDate: endDate?.formatISO() ?? null,
      responsibleUserId: responsibleUser.id,
      startDate: startDate?.formatISO() ?? null,
      plannedTime: plannedTime ? plannedTime : null,
    };

    await onTaskAdd(dto);

    clearForm();

    rerenderTimePicker();
    initDates();

    textareaRef.current?.focus();
  }

  const onSelectResponsibleUser = (user: User) => {
    form.responsibleUser = user;
  };

  const onChangePlannedTime = (newPlannedTime: number) => {
    form.plannedTime = newPlannedTime;
  };

  const showDates = Boolean(form.startDate || form.endDate);

  useOnClickOutside(rootRef as RefObject<HTMLDivElement>, e => {
    const target = e.target as HTMLElement;

    const isDropdownOrPopover =
      target.closest('.workspace__MyDropdown--StyledDropdown') ||
      target.closest('.workspace__MyPopover--StyledDropdown');

    // check if click was on add quick task control in specific (by id) Column header
    const isAddPlusIcon = target.closest(`.${ADD_QUICK_TASK_CONTROL_CLASS}-${id}`);

    if (isDropdownOrPopover || isAddPlusIcon) return;

    handleAdd(true);
  });

  useWindowEvent('keydown', e => {
    switch (e.key) {
      case 'Escape': {
        e.preventDefault();
        hide();

        break;
      }

      case 'Enter': {
        e.preventDefault();
        handleAdd();

        break;
      }
    }
  });

  return (
    <Root ref={rootRef}>
      <Form $datesShown={showDates}>
        <MyTextArea
          ref={textareaRef}
          autoFocus
          alwaysActive
          loading={loading}
          model={form.title}
          placeholder={t('task_title')}
        />

        {showDates && (
          <DatesWrapper>
            {form.startDate.value && (
              <Date>{(form.startDate.value as UtcDate).format('MMM D, HH:mm')}</Date>
            )}

            {form.endDate.value && (
              <Date>{(form.endDate.value as UtcDate).format('MMM D, HH:mm')}</Date>
            )}
          </DatesWrapper>
        )}

        <PickersWrapper>
          <UserPicker
            showValue={false}
            users={userStore.activeUsers}
            selectedId={form.responsibleUser.id}
            onSelect={onSelectResponsibleUser}
          />

          <MyDatePickerWithTime
            onlyIcon
            withinPortal
            iconOutlined
            variant="primary"
            model={form.startDate}
            disabled={startDateDisabled}
            disableDatesAfter={form.endDate.value}
            dropdownTitle={t('update_task_modal.start_date')}
          />

          <MyDatePickerWithTime
            onlyIcon
            withinPortal
            iconOutlined
            iconType="end"
            variant="primary"
            model={form.endDate}
            disabled={endDateDisabled}
            disableDatesBefore={form.startDate.value}
            dropdownTitle={t('update_task_modal.end_date')}
          />

          <PlannedTimePicker
            minified
            key={timePickerKey.toString()}
            defaultValue={form.plannedTime}
            changeValue={onChangePlannedTime}
          />
        </PickersWrapper>
      </Form>
    </Root>
  );
});

AddQuickTaskBlock.displayName = 'AddQuickTaskBlock';
export { AddQuickTaskBlock };
