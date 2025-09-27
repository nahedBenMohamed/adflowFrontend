import {
  FilterItemWrapper,
  MyInput,
  MySelect,
  type InputModel,
  type Nullable,
  type Option,
  type SelectModel,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { StringFilterType } from '../../../../models';
import type { FieldFilterModelState } from '../../../../types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  name: string;
  text: InputModel;
  type: SelectModel;
  changeState: (state: FieldFilterModelState) => void;
  handleApply: () => void;
}

const FieldFilterString = observer((props: Props) => {
  const { name, text, type, changeState, handleApply } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.filter_button.ui.filter_drawer.field_filter_string',
  });

  const handleChangeType = (value: Nullable<StringFilterType>) => {
    if (value) {
      changeState('changed');

      if (value !== StringFilterType.CONTAINS) text.setValue('');
    } else {
      changeState('unchanged');
    }

    handleApply();
  };

  const handleChangeText = () => {
    changeState('changed');
    handleApply();
  };

  const typeOptions: Option<StringFilterType>[] = [
    { label: t('is_empty'), value: StringFilterType.EMPTY },
    { label: t('is_not_empty'), value: StringFilterType.NOT_EMPTY },
    { label: t('contains'), value: StringFilterType.CONTAINS },
  ];

  const handleClear = () => {
    handleChangeType(null);

    type.setValue(null);
    text.setValue('');

    handleApply();
  };

  return (
    <FilterItemWrapper
      label={name}
      labelPaddingTop="4px"
      alignItemsCenter={false}
      clearProps={{
        clearVisible: Boolean(type.value),
        onClear: handleClear,
      }}
    >
      <Wrapper>
        <MySelect
          variant="outlined"
          options={typeOptions}
          model={type}
          activeBgColor={Boolean(type.value)}
          handleChange={handleChangeType}
        />

        {type.value === StringFilterType.CONTAINS && (
          <MyInput
            autoFocus
            model={text}
            variant="outlined"
            placeholder={t('placeholders.value')}
            handleChange={handleChangeText}
          />
        )}
      </Wrapper>
    </FilterItemWrapper>
  );
});

FieldFilterString.displayName = 'FieldFilterString';
export { FieldFilterString };
