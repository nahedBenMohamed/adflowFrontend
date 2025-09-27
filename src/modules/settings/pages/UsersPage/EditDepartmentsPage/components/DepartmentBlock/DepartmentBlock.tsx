import { generalSettingsStore } from '@/app';
import { queryClient } from '@/index';
import {
  debounce,
  DeleteButton,
  ExpandButton,
  GroupIcon,
  InputModel,
  MyInput,
  MyTimePickerInput,
  UtcDate,
  type MyTimePickerInputProps,
} from '@/shared';
import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  SETTINGS_QUERY_KEYS,
  UpdateDepartmentDto,
  type CreateDepartmentDto,
} from '../../../../../api';
import type { Department } from '../../../../../shared';
import { DeleteDepartmentWarningModal } from '../DeleteDepartmentWarningModal/DeleteDepartmentWarningModal';
import { SubdepartmentsList } from '../SubdepartmentsList/SubdepartmentsList';

const Root = styled.li`
  flex-direction: column;

  padding: 16px 16px 0;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
`;

const TopBlock = styled.div<{ $deleteButtonVisible: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding-bottom: 12px;

  .workspace__DeleteButton--Root {
    opacity: ${p => (p.$deleteButtonVisible ? 1 : 0)};
    scale: ${p => (p.$deleteButtonVisible ? 1 : 0)};
  }

  &:hover {
    .workspace__DeleteButton--Root {
      opacity: 1;
      scale: 1;
    }
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
`;

const RightBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const WorkingTimeWrapper = styled.div`
  width: max-content;
  min-width: 152px;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
`;

const Bulkhead = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: var(--button-text-graphite-primary-text);
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DepartmentIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const BottomBlock = styled(Collapse)`
  border-top: 1px solid var(--graphite-graphite-80);
`;

const BottomBlockContent = styled.div`
  padding: 12px 0 16px;
`;

interface Props {
  department: Department;
  defaultOpened: boolean;
  addDepartment: (dto: CreateDepartmentDto) => Promise<void>;
  updateDepartment: ({ id, dto }: { id: number; dto: UpdateDepartmentDto }) => Promise<void>;
  deleteDepartment: ({
    id,
    newDepartmentId,
  }: {
    id: number;
    newDepartmentId?: number;
  }) => Promise<void>;
}

const DepartmentBlock = observer((props: Props) => {
  const { department, defaultOpened, addDepartment, updateDepartment, deleteDepartment } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.edit_groups_page',
  });

  const [deleteWarningOpened, { close: hideDeleteWarning, open: showDeleteWarning }] =
    useDisclosure(false);

  const { accountSettings } = generalSettingsStore;

  const departmentSettingsForm = useLocalObservable(() => ({
    name: InputModel.create(department.name).required(),
    workingTimeFrom: InputModel.create(
      department.settings?.workingTimeFrom ?? accountSettings?.workingTimeFrom ?? '00:00'
    ),
    workingTimeTo: InputModel.create(
      department.settings?.workingTimeTo ?? accountSettings?.workingTimeTo ?? '23:59'
    ),
  }));

  const [opened, { toggle }] = useDisclosure(defaultOpened);
  const [
    deleteButtonVisible,
    { toggle: toggleDeleteButton, close: hideDeleteButton, open: showDeleteButton },
  ] = useDisclosure(defaultOpened);
  const [updating, setUpdating] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateGroup = useCallback(
    debounce(async (): Promise<void> => {
      if (!departmentSettingsForm.name.validate()) return;

      try {
        setUpdating(true);

        const dto = new UpdateDepartmentDto({
          name: departmentSettingsForm.name.trimmedValue,
          settings: {
            workingTimeFrom: departmentSettingsForm.workingTimeFrom.value,
            workingTimeTo: departmentSettingsForm.workingTimeTo.value,
          },
        });

        await updateDepartment({ id: department.id, dto });

        await queryClient.invalidateQueries({
          queryKey: SETTINGS_QUERY_KEYS.departmentSettings(department.id),
        });
      } finally {
        setUpdating(false);
      }
    }, 500),
    []
  );

  const handleChangeWorkingTime = useCallback(() => {
    const workingTimeFromSeconds = UtcDate.parseHoursStringToSeconds(
      departmentSettingsForm.workingTimeFrom.value
    );
    const workingTimeToSeconds = UtcDate.parseHoursStringToSeconds(
      departmentSettingsForm.workingTimeTo.value
    );

    // to prevent setting end time earlier than start time
    if (workingTimeFromSeconds >= workingTimeToSeconds) {
      // edge case when start time is 23:30 or later
      if (workingTimeFromSeconds >= 23.5 * 60 * 60) {
        departmentSettingsForm.workingTimeTo.setValue('23:59');

        return;
      }

      // add 30 minutes to start time
      departmentSettingsForm.workingTimeTo.setValue(
        UtcDate.secondsToHoursString(workingTimeFromSeconds + 60 * 30)
      );
    }

    debouncedUpdateGroup();
  }, [
    debouncedUpdateGroup,
    departmentSettingsForm.workingTimeFrom.value,
    departmentSettingsForm.workingTimeTo,
  ]);

  useEffect(() => {
    department.name = departmentSettingsForm.name.value;
    department.settings = {
      workingTimeFrom: departmentSettingsForm.workingTimeFrom.value,
      workingTimeTo: departmentSettingsForm.workingTimeTo.value,
    };
  }, [
    department,
    departmentSettingsForm.name.value,
    departmentSettingsForm.workingTimeFrom.value,
    departmentSettingsForm.workingTimeTo.value,
  ]);

  const pickerDropdownProps = useMemo<MyTimePickerInputProps['pickerDropdownProps']>(
    () => ({
      step: 30,
      inModal: true,
    }),
    []
  );

  return (
    <Root>
      <TopBlock $deleteButtonVisible={deleteButtonVisible}>
        <InputWrapper>
          <DepartmentIconWrapper>
            <GroupIcon />
          </DepartmentIconWrapper>

          <MyInput
            medium
            loading={updating}
            model={departmentSettingsForm.name}
            placeholder={t('placeholders.group')}
            onBlur={hideDeleteButton}
            onFocus={showDeleteButton}
            handleChange={debouncedUpdateGroup}
          />
        </InputWrapper>

        <RightBlock>
          <WorkingTimeWrapper>
            <MyTimePickerInput
              pickerDropdownProps={pickerDropdownProps}
              model={departmentSettingsForm.workingTimeFrom}
              handleChange={handleChangeWorkingTime}
            />

            <Bulkhead>{t('to')}</Bulkhead>

            <MyTimePickerInput
              pickerDropdownProps={pickerDropdownProps}
              model={departmentSettingsForm.workingTimeTo}
              handleChange={handleChangeWorkingTime}
            />
          </WorkingTimeWrapper>

          <IconsWrapper>
            <DeleteButton size="medium" onClick={showDeleteWarning} />

            <ExpandButton
              expanded={opened}
              onClick={() => {
                toggle();
                toggleDeleteButton();
              }}
            />
          </IconsWrapper>
        </RightBlock>
      </TopBlock>

      <BottomBlock in={opened} transitionDuration={100}>
        <BottomBlockContent>
          <SubdepartmentsList
            parentId={department.id}
            subdepartments={department.subordinates}
            onAdd={addDepartment}
            onUpdate={updateDepartment}
            onDelete={deleteDepartment}
          />
        </BottomBlockContent>
      </BottomBlock>

      {deleteWarningOpened && (
        <DeleteDepartmentWarningModal
          parent
          departmentId={department.id}
          opened={deleteWarningOpened}
          departmentName={department.name}
          onDelete={deleteDepartment}
          onClose={hideDeleteWarning}
        />
      )}
    </Root>
  );
});

DepartmentBlock.displayName = 'DepartmentBlock';
export { DepartmentBlock };
