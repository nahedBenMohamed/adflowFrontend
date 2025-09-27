import { MyDatePeriodPicker, type DateFilterFormData, type UtcDateValue } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AutomationFormItem } from '../../../AutomationFormItem/AutomationFormItem';

interface Props {
  formData: DateFilterFormData;
}

const EntityTypeFieldFilterDate = observer((props: Props) => {
  const { formData } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.conditions_block',
  });

  const handleChangeTo = useCallback((date: UtcDateValue) => (formData.to = date), [formData]);
  const handleChangeFrom = useCallback((date: UtcDateValue) => (formData.from = date), [formData]);

  return (
    <AutomationFormItem text={t('condition')}>
      <MyDatePeriodPicker
        withinPortal
        to={formData.to}
        from={formData.from}
        position="bottom-start"
        handleChangeTo={handleChangeTo}
        handleChangeFrom={handleChangeFrom}
      />
    </AutomationFormItem>
  );
});

EntityTypeFieldFilterDate.displayName = 'EntityTypeFieldFilterDate';
export { EntityTypeFieldFilterDate };
