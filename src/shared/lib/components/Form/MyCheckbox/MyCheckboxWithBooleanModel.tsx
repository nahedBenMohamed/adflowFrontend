import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import type { BooleanModel, MyCheckboxVariant } from '../../../models';
import { MyCheckbox } from './MyCheckbox';

interface Props {
  model: BooleanModel;
  variant?: MyCheckboxVariant;
  disabled?: boolean;
  handleChange?: (value: boolean) => void;
}

const MyCheckboxWithBooleanModel = observer((props: Props) => {
  const { model, variant, disabled, handleChange } = props;

  const onChange = useCallback(() => {
    const newValue = !model.value;

    model.setValue(newValue);

    handleChange?.(newValue);
  }, [model, handleChange]);

  return (
    <MyCheckbox
      variant={variant}
      disabled={disabled}
      checked={model.value}
      invalid={!model.isValid}
      onChange={onChange}
    />
  );
});

MyCheckboxWithBooleanModel.displayName = 'MyCheckboxWithBooleanModel';
export { MyCheckboxWithBooleanModel };
