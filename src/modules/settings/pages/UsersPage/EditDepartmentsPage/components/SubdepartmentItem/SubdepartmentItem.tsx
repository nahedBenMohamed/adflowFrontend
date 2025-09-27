import { generalSettingsStore } from '@/app';
import { queryClient } from '@/index';
import {
  debounce,
  DeleteButton,
  InputModel,
  MyInput,
  MyTimePickerInput,
  type MyTimePickerInputProps,
  SubgroupIcon,
  UtcDate,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SETTINGS_QUERY_KEYS, UpdateDepartmentDto } from '../../../../../api';
import type { Department } from '../../../../../shared';
import { DeleteDepartmentWarningModal } from '../DeleteDepartmentWarningModal/DeleteDepartmentWarningModal';

const Root = styled.li<{ $deleteButtonVisible: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

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

const RightBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 56px;
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

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  subdepartment: Department;
  onUpdate: ({ id, dto }: { id: number; dto: UpdateDepartmentDto }) => Promise<void>;
  onDelete: ({ id, newDepartmentId }: { id: number; newDepartmentId?: number }) => Promise<void>;
}

const SubdepartmentItem = observer((props: Props) => {
  const { subdepartment, onUpdate, onDelete } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.edit_groups_page',
  });

  const [updating, setUpdating] = useState(false);

  const { accountSettings } = generalSettingsStore;

  const subdepartmentSettingsForm = useLocalObservable(() => ({
    name: InputModel.create(subdepartment.name).required(),
    workingTimeFrom: InputModel.create(
      subdepartment.settings?.workingTimeFrom ?? accountSettings?.workingTimeFrom ?? '00:00'
    ),
    workingTimeTo: InputModel.create(
      subdepartment.settings?.workingTimeTo ?? accountSettings?.workingTimeTo ?? '23:59'
    ),
  }));

  const [deleteButtonVisible, { close: hideDeleteButton, open: showDeleteButton }] =
    useDisclosure(false);
  const [
    deleteWarningModalOpened,
    { close: hideDeleteWarningModal, open: showDeleteWarningModal },
  ] = useDisclosure(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateGroup = useCallback(
    debounce(async (): Promise<void> => {
      if (!subdepartmentSettingsForm.name.validate()) return;

      try {
        setUpdating(true);
        const dto = new UpdateDepartmentDto({
          name: subdepartmentSettingsForm.name.trimmedValue,
          settings: {
            workingTimeFrom: subdepartmentSettingsForm.workingTimeFrom.value,
            workingTimeTo: subdepartmentSettingsForm.workingTimeTo.value,
          },
        });

        await onUpdate({ id: subdepartment.id, dto });

        await queryClient.invalidateQueries({
          queryKey: SETTINGS_QUERY_KEYS.departmentSettings(subdepartment.id),
        });
      } finally {
        setUpdating(false);
      }
    }, 500),
    []
  );

  const handleChangeWorkingTime = useCallback(() => {
    const workingTimeFromSeconds = UtcDate.parseHoursStringToSeconds(
      subdepartmentSettingsForm.workingTimeFrom.value
    );
    const workingTimeToSeconds = UtcDate.parseHoursStringToSeconds(
      subdepartmentSettingsForm.workingTimeTo.value
    );

    // to prevent setting end time earlier than start time
    if (workingTimeFromSeconds >= workingTimeToSeconds) {
      // edge case when start time is 23:30 or later
      if (workingTimeFromSeconds >= 23.5 * 60 * 60) {
        subdepartmentSettingsForm.workingTimeTo.setValue('23:59');

        return;
      }

      // add 30 minutes to start time
      subdepartmentSettingsForm.workingTimeTo.setValue(
        UtcDate.secondsToHoursString(workingTimeFromSeconds + 60 * 30)
      );
    }

    debouncedUpdateGroup();
  }, [
    debouncedUpdateGroup,
    subdepartmentSettingsForm.workingTimeFrom.value,
    subdepartmentSettingsForm.workingTimeTo,
  ]);

  useEffect(() => {
    subdepartment.name = subdepartmentSettingsForm.name.value;
    subdepartment.settings = {
      workingTimeFrom: subdepartmentSettingsForm.workingTimeFrom.value,
      workingTimeTo: subdepartmentSettingsForm.workingTimeTo.value,
    };
  }, [
    subdepartment,
    subdepartmentSettingsForm.name.value,
    subdepartmentSettingsForm.workingTimeFrom.value,
    subdepartmentSettingsForm.workingTimeTo.value,
  ]);

  const pickerDropdownProps = useMemo<MyTimePickerInputProps['pickerDropdownProps']>(
    () => ({
      step: 30,
      inModal: true,
    }),
    []
  );

  return (
    <Root $deleteButtonVisible={deleteButtonVisible}>
      <IconWrapper>
        <SubgroupIcon />
      </IconWrapper>

      <MyInput
        loading={updating}
        placeholder={t('subgroup')}
        model={subdepartmentSettingsForm.name}
        onBlur={hideDeleteButton}
        onFocus={showDeleteButton}
        handleChange={debouncedUpdateGroup}
      />

      <RightBlock>
        <WorkingTimeWrapper>
          <MyTimePickerInput
            pickerDropdownProps={pickerDropdownProps}
            model={subdepartmentSettingsForm.workingTimeFrom}
            handleChange={handleChangeWorkingTime}
          />

          <Bulkhead>{t('to')}</Bulkhead>

          <MyTimePickerInput
            pickerDropdownProps={pickerDropdownProps}
            model={subdepartmentSettingsForm.workingTimeTo}
            handleChange={handleChangeWorkingTime}
          />
        </WorkingTimeWrapper>

        <DeleteButton size="medium" onClick={showDeleteWarningModal} />
      </RightBlock>

      {deleteWarningModalOpened && (
        <DeleteDepartmentWarningModal
          parent={false}
          departmentId={subdepartment.id}
          opened={deleteWarningModalOpened}
          departmentName={subdepartmentSettingsForm.name.value}
          onDelete={onDelete}
          onClose={hideDeleteWarningModal}
        />
      )}
    </Root>
  );
});

SubdepartmentItem.displayName = 'SubdepartmentItem';
export { SubdepartmentItem };
