import type { Field } from '@/modules/fields';
import { MultiselectWithCheckboxes, type Option, type SelectFilterFormData } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AutomationFormItem } from '../../../AutomationFormItem/AutomationFormItem';

interface Props {
  field: Field;
  formData: SelectFilterFormData;
}

const EntityTypeFieldFilterSelect = observer((props: Props) => {
  const { field, formData } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.conditions_block',
  });

  const options = useMemo<Option<number>[]>(
    () =>
      field.options.map<Option<number>>(o => ({
        value: o.id,
        label: o.label,
      })),
    [field.options]
  );

  return (
    <AutomationFormItem text={t('condition')}>
      <MultiselectWithCheckboxes
        withinPortal
        options={options}
        variant="outlined"
        model={formData.optionIds}
        placeholder={t('placeholders.selected_options')}
      />
    </AutomationFormItem>
  );
});

EntityTypeFieldFilterSelect.displayName = 'EntityTypeFieldFilterSelect';
export { EntityTypeFieldFilterSelect };
