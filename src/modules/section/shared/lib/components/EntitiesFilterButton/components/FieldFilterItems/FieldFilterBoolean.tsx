import {
  FilterItemWrapper,
  MySelect,
  type MySelectOptionValueType,
  type Option,
  type SelectModel,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { type FieldFilterModelState } from '../../../../types';

interface Props {
  name: string;
  value: SelectModel;
  changeState: (state: FieldFilterModelState) => void;
  handleApply: () => void;
}

const FieldFilterBoolean = observer((props: Props) => {
  const { name, value, changeState, handleApply } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.filter_button.ui.field_filter_items.field_filter_boolean',
  });

  const switchOptions: Option<boolean>[] = [
    {
      label: t('switch_on'),
      value: true,
    },
    {
      label: t('switch_off'),
      value: false,
    },
  ];

  const handleChange = (value: MySelectOptionValueType) => {
    if (value !== undefined) {
      changeState('changed');
    } else {
      changeState('unchanged');
    }

    handleApply();
  };

  const onClear = () => {
    handleChange(undefined);
    value.setValue(undefined);

    handleApply();
  };

  return (
    <FilterItemWrapper
      label={name}
      clearProps={{
        clearVisible: value.value !== undefined,
        onClear,
      }}
    >
      <MySelect
        variant="outlined"
        model={value}
        options={switchOptions}
        activeBgColor={value.value !== undefined}
        handleChange={handleChange}
      />
    </FilterItemWrapper>
  );
});

FieldFilterBoolean.displayName = 'FieldFilterBoolean';
export { FieldFilterBoolean };
