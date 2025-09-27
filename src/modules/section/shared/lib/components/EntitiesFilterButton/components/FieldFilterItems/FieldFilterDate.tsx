import {
  FilterItemWrapper,
  MyDatePeriodPicker,
  type DateFilterFormData,
  type UtcDateValue,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useReducer } from 'react';
import type { FieldFilterModelState } from '../../../../types';

interface Props {
  name: string;
  fieldFilterDateForm: DateFilterFormData;
  changeState: (state: FieldFilterModelState) => void;
  handleApply: () => void;
}

const FieldFilterDate = observer((props: Props) => {
  const { name, fieldFilterDateForm, changeState, handleApply } = props;

  const [pickerKey, forcePickerRerender] = useReducer(x => ++x, 0);

  const handleChangeFrom = (date: UtcDateValue) => {
    fieldFilterDateForm.from = date;

    if (date) changeState('changed');

    handleApply();
  };

  const handleChangeTo = (date: UtcDateValue) => {
    fieldFilterDateForm.to = date;

    if (date) changeState('changed');

    handleApply();
  };

  const onClear = () => {
    fieldFilterDateForm.from = null;
    fieldFilterDateForm.to = null;

    changeState('unchanged');
    forcePickerRerender();
    handleApply();
  };

  return (
    <FilterItemWrapper
      label={name}
      clearProps={{
        clearVisible: Boolean(fieldFilterDateForm.from || fieldFilterDateForm.to),
        onClear,
      }}
    >
      <MyDatePeriodPicker
        key={pickerKey}
        withinPortal
        position="bottom-end"
        to={fieldFilterDateForm.to}
        from={fieldFilterDateForm.from}
        activeBgColor={Boolean(fieldFilterDateForm.from || fieldFilterDateForm.to)}
        handleChangeTo={handleChangeTo}
        handleChangeFrom={handleChangeFrom}
      />
    </FilterItemWrapper>
  );
});

FieldFilterDate.displayName = 'FieldFilterDate';
export { FieldFilterDate };
