import { FormItem, FormItemLabel, UserPicker, type SelectModel, type User } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { FieldValuesStore, FieldsStore } from '../../../../../../../store';
import { FieldCode, type Field } from '../../../../../models';
import { ProjectSystemFieldValueFormGroup } from '../ProjectSystemFieldValueFormGroup/ProjectSystemFieldValueFormGroup';

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  gap: 20px;
`;

interface Props {
  users: User[];
  fieldsStore: FieldsStore;
  fieldValuesStore: FieldValuesStore;
  responsibleUserIdModel: SelectModel;
  activeProjectFieldCodes: FieldCode[];
  handleChangeResponsibleUserId: (user: User) => void;
}

const ProjectFieldsBlock = observer((props: Props) => {
  const {
    users,
    fieldsStore,
    fieldValuesStore,
    responsibleUserIdModel,
    activeProjectFieldCodes,
    handleChangeResponsibleUserId,
  } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.project_fields_block',
  });

  const projectFields = useMemo<Field[]>(
    () => [
      fieldsStore.getFieldByCode(FieldCode.START_DATE),
      fieldsStore.getFieldByCode(FieldCode.END_DATE),
      fieldsStore.getFieldByCode(FieldCode.PARTICIPANTS),
      fieldsStore.getFieldByCode(FieldCode.DESCRIPTION),
    ],
    [fieldsStore]
  );

  const isActive = useCallback(
    (field: Field): boolean => (field.code ? activeProjectFieldCodes.includes(field.code) : false),
    [activeProjectFieldCodes]
  );

  const getFieldComponent = useCallback(
    (field: Field): ReactNode =>
      isActive(field) && (
        <ProjectSystemFieldValueFormGroup
          key={field.id}
          field={field}
          isProjectFields
          fieldValue={fieldValuesStore.getOrCreateByField(field)}
          gridColumn={field.code === FieldCode.DESCRIPTION ? '1 / 3' : undefined}
        />
      ),
    [fieldValuesStore, isActive]
  );

  return (
    <Root>
      <FormItem gap="8px">
        <FormItemLabel $color="var(--button-text-graphite-primary-text)">
          {t('owner')}
        </FormItemLabel>

        <UserPicker
          withinPortal
          users={users}
          selectedId={responsibleUserIdModel.value}
          onSelect={handleChangeResponsibleUserId}
        />
      </FormItem>

      {projectFields.map(getFieldComponent)}
    </Root>
  );
});

ProjectFieldsBlock.displayName = 'ProjectFieldsBlock';
export { ProjectFieldsBlock };
