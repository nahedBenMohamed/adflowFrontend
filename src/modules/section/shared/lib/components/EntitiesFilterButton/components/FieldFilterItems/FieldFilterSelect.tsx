import type { FieldOption } from '@/modules/fields';
import {
  FilterItemWrapper,
  MultiselectWithCheckboxes,
  MyMultiselectColored,
  type MultiselectModel,
  type Nullable,
  type Option,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import type { FieldFilterModelState } from '../../../../types';

interface Props {
  name: string;
  fieldOptions: FieldOption[];
  optionIds: MultiselectModel<number>;
  colored?: boolean;
  changeState: (state: FieldFilterModelState) => void;
  handleApply: () => void;
}

const FieldFilterSelect = observer((props: Props) => {
  const { name, fieldOptions, optionIds, colored, changeState, handleApply } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.filter_button.ui.filter_drawer',
  });

  const options = fieldOptions.map<Option<number, { bgColor: Nullable<string> }>>(fo => ({
    value: fo.id,
    label: fo.label,
    extra: { bgColor: fo.color },
  }));

  const handleChangeOptionIds = (values: number[]) => {
    if (values.length > 0) {
      changeState('changed');
    } else {
      changeState('unchanged');
    }

    handleApply();
  };

  const handleClear = () => {
    handleChangeOptionIds([]);
    optionIds.setValue([]);

    handleApply();
  };

  const wrapperAlignmentProps = colored
    ? {
        alignItemsCenter: false,
        labelPaddingTop: '6px',
      }
    : {};

  return (
    <FilterItemWrapper
      {...wrapperAlignmentProps}
      label={name}
      clearProps={{
        clearVisible: optionIds.values.length > 0,
        onClear: handleClear,
      }}
    >
      {colored ? (
        <MyMultiselectColored
          model={optionIds}
          options={options}
          placeholder={t('placeholders.selected_options')}
          handleChange={handleChangeOptionIds}
        />
      ) : (
        <MultiselectWithCheckboxes
          withinPortal
          variant="outlined"
          model={optionIds}
          options={options}
          activeBgColor={optionIds.values.length > 0}
          placeholder={t('placeholders.selected_options')}
          handleChange={handleChangeOptionIds}
        />
      )}
    </FilterItemWrapper>
  );
});

FieldFilterSelect.displayName = 'FieldFilterSelect';
export { FieldFilterSelect };
