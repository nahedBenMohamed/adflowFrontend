import { FormItem, FormItemLabel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import type { Field } from '../../../../../models';
import type { PossibleFieldValue } from '../../../../../types';
import { FieldValueSwitch } from '../../../FieldValueSwitch';

interface Props {
  field: Field;
  fieldValue: PossibleFieldValue;
  isProjectFields?: boolean;
  gridColumn?: string;
}

const ProjectSystemFieldValueFormGroup = observer((props: Props) => {
  const { field, fieldValue, isProjectFields, gridColumn } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.project_fields_block',
  });

  const fieldCode = field.code;

  if (!fieldCode)
    throw new Error(`Project field should have a code, instead received ${fieldCode}`);

  return (
    <FormItem gap="8px" gridColumn={gridColumn}>
      <FormItemLabel $color="var(--button-text-graphite-primary-text)">
        {t(fieldCode)}
      </FormItemLabel>

      <FieldValueSwitch
        field={field}
        alwaysHideIndicator
        fieldValue={fieldValue}
        isProjectFields={isProjectFields}
      />
    </FormItem>
  );
});

ProjectSystemFieldValueFormGroup.displayName = 'ProjectSystemFieldValueFormGroup';
export { ProjectSystemFieldValueFormGroup };
