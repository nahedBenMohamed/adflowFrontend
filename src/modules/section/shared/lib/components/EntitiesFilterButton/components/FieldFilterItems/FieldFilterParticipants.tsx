import {
  FilterItemWrapper,
  ParticipantsSelectWithCreateButton,
  type MultiselectModel,
} from '@/shared';
import { type FieldFilterModelState } from '../../../../types';

interface Props {
  name: string;
  optionIds: MultiselectModel<number>;
  changeState: (state: FieldFilterModelState) => void;
  handleApply: () => void;
}

const FieldFilterParticipants = (props: Props) => {
  const { name, optionIds, changeState, handleApply } = props;

  const handleChangeOptionIds = (values: number[]) => {
    if (values.length > 0) {
      changeState('changed');
    } else {
      changeState('unchanged');
    }

    handleApply();
  };

  return (
    <FilterItemWrapper label={name}>
      <ParticipantsSelectWithCreateButton
        model={optionIds}
        maxAvatarCount={2}
        handleChange={handleChangeOptionIds}
      />
    </FilterItemWrapper>
  );
};

export { FieldFilterParticipants };
