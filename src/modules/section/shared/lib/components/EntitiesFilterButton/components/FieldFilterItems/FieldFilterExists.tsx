import {
  ExistsFilterType,
  FilterItemWrapper,
  MySelect,
  type ExistsFilterFormData,
  type Nullable,
  type Option,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import type { FieldFilterModelState } from '../../../../types';

interface Props {
  name: string;
  fieldFilterForm: ExistsFilterFormData;
  changeState: (state: FieldFilterModelState) => void;
  handleApply: () => void;
}

const FieldFilterExists = observer((props: Props) => {
  const { name, fieldFilterForm, changeState, handleApply } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.filter_button.ui.filter_drawer.field_filter_exists',
  });

  const typeOptions: Option<ExistsFilterType>[] = [
    { label: t('is_empty'), value: ExistsFilterType.EMPTY },
    { label: t('is_not_empty'), value: ExistsFilterType.NOT_EMPTY },
  ];

  const handleChangeType = (value: Nullable<ExistsFilterType>) => {
    if (value) {
      changeState('changed');
    } else {
      changeState('unchanged');
    }

    handleApply();
  };

  const onClear = () => {
    fieldFilterForm.type.resetValue();

    changeState('unchanged');
    handleApply();
  };

  return (
    <FilterItemWrapper
      label={name}
      clearProps={{
        clearVisible: Boolean(fieldFilterForm.type.value),
        onClear,
      }}
    >
      <MySelect
        variant="outlined"
        options={typeOptions}
        model={fieldFilterForm.type}
        activeBgColor={Boolean(fieldFilterForm.type.value)}
        handleChange={handleChangeType}
      />
    </FilterItemWrapper>
  );
});

FieldFilterExists.displayName = 'FieldFilterExists';
export { FieldFilterExists };
