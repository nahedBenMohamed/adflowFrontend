import {
  DialogModalPrimary,
  ModalAnnotation,
  ModalContentTitle,
  ModalTrashBinIcon,
  MySelect,
  SelectModel,
  type Option,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { Department } from '../../../../../shared';
import { departmentsSettingsStore } from '../../../../../store';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  padding: 8px 24px 32px;
`;

const Content = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const SelectsWrapper = styled.div`
  width: 80%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  margin-top: 16px;
`;

interface Props {
  parent: boolean;
  departmentId: number;
  departmentName: string;
  opened: boolean;
  onClose: () => void;
  onDelete: ({ id, newDepartmentId }: { id: number; newDepartmentId?: number }) => Promise<void>;
}

interface InitialForm {
  parent: SelectModel;
  subordinate: SelectModel;
}

const DeleteDepartmentWarningModal = observer((props: Props) => {
  const { parent, departmentId, departmentName, opened, onClose, onDelete } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.edit_groups_page',
  });

  const { departments } = departmentsSettingsStore;

  const [isDeleting, setIsDeleting] = useState(false);

  const form = useLocalObservable<InitialForm>(() => ({
    parent: SelectModel.create(),
    subordinate: SelectModel.create(),
  }));

  const parentOptions = parent
    ? departments
        .filter(g => g.id !== departmentId)
        .map<Option<number>>(g => ({
          value: g.id,
          label: g.name,
        }))
    : departments.map<Option<number>>(g => ({
        value: g.id,
        label: g.name,
      }));

  const parentSubdepartments: Department[] =
    departments.find(g => g.id === form.parent.value)?.subordinates ?? [];

  const parentSubdepartmentsOptions = parentSubdepartments
    .filter(ps => ps.id !== departmentId)
    .map<Option<number>>(ps => ({
      value: ps.id,
      label: ps.name,
    }));

  const handleApproveDelete = async (): Promise<void> => {
    try {
      setIsDeleting(true);

      if (form.parent.value && form.subordinate.value) {
        await onDelete({ id: departmentId, newDepartmentId: form.subordinate.value });

        return;
      }

      if (form.parent.value) {
        await onDelete({ id: departmentId, newDepartmentId: form.parent.value });

        return;
      }

      await onDelete({ id: departmentId });

      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DialogModalPrimary
      isDanger
      width="488px"
      maxHeight="100%"
      isOpened={opened}
      height="fit-content"
      approveTitle={t('delete')}
      cancelDisabled={isDeleting}
      approveLoading={isDeleting}
      approveDisabled={isDeleting}
      onClose={onClose}
      onApprove={handleApproveDelete}
    >
      <Root>
        <ModalTrashBinIcon />

        <Content>
          <ModalContentTitle>
            {t('delete_warning_title', { name: departmentName })}
          </ModalContentTitle>

          <ModalAnnotation>
            {t('delete_warning_annotation1')} {parent && t('delete_warning_annotation2')}{' '}
            {t('delete_warning_annotation3')}
          </ModalAnnotation>

          <SelectsWrapper>
            {parentOptions.length > 0 && (
              <MySelect
                withinPortal
                variant="outlined"
                model={form.parent}
                options={parentOptions}
                placeholder={t('placeholders.select_group')}
              />
            )}

            {parentSubdepartmentsOptions.length > 0 && (
              <MySelect
                withinPortal
                variant="outlined"
                model={form.subordinate}
                options={parentSubdepartmentsOptions}
                placeholder={t('placeholders.select_subgroup')}
              />
            )}
          </SelectsWrapper>
        </Content>
      </Root>
    </DialogModalPrimary>
  );
});

DeleteDepartmentWarningModal.displayName = 'DeleteDepartmentWarningModal';
export { DeleteDepartmentWarningModal };
