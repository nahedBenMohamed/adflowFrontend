import { MySelect, type BooleanFilterFormData, type Option } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AutomationFormItem } from '../../../AutomationFormItem/AutomationFormItem';

interface Props {
  formData: BooleanFilterFormData;
}

const EntityTypeFieldFilterBoolean = observer((props: Props) => {
  const { formData } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.conditions_block',
  });

  const switchOptions = useMemo<Option<boolean>[]>(
    () => [
      {
        label: t('entity_type_field_filter_boolean.switch_on'),
        value: true,
      },
      {
        label: t('entity_type_field_filter_boolean.switch_off'),
        value: false,
      },
    ],
    [t]
  );

  return (
    <AutomationFormItem text={t('condition')}>
      <MySelect withinPortal variant="outlined" model={formData.value} options={switchOptions} />
    </AutomationFormItem>
  );
});

EntityTypeFieldFilterBoolean.displayName = 'EntityTypeFieldFilterBoolean';
export { EntityTypeFieldFilterBoolean };
