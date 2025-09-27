import { FilterItemWrapper, MyInput, type InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { FieldFilterModelState } from '../../../../types';

const InputsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Delimiter = styled.hr`
  width: 6px;

  flex-shrink: 0;

  border-top: 1px solid var(--button-text-graphite-primary-text);
`;

interface Props {
  name: string;
  min: InputModel;
  max: InputModel;
  changeState: (state: FieldFilterModelState) => void;
  handleApply: () => void;
}

const FieldFilterNumber = observer((props: Props) => {
  const { name, min, max, changeState, handleApply } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.filter_button.ui.field_filter_items.field_filter_number',
  });

  const handleChangeFrom = (value: string) => {
    if (value.trim().length > 0) {
      changeState('changed');
    } else if (max.trimmedValue.length === 0) {
      changeState('unchanged');
    }

    handleApply();
  };

  const handleChangeTo = (value: string) => {
    if (value.trim().length > 0) {
      changeState('changed');
    } else if (min.trimmedValue.length === 0) {
      changeState('unchanged');
    }

    handleApply();
  };

  return (
    <FilterItemWrapper label={name}>
      <InputsWrapper>
        <MyInput
          model={min}
          type="number"
          variant="outlined"
          hideNumberInputControls
          placeholder={t('from')}
          activeBgColor={min.trimmedValue.length > 0}
          handleChange={handleChangeFrom}
        />

        <Delimiter />

        <MyInput
          model={max}
          type="number"
          variant="outlined"
          placeholder={t('to')}
          hideNumberInputControls
          activeBgColor={max.trimmedValue.length > 0}
          handleChange={handleChangeTo}
        />
      </InputsWrapper>
    </FilterItemWrapper>
  );
});

FieldFilterNumber.displayName = 'FieldFilterNumber';
export { FieldFilterNumber };
