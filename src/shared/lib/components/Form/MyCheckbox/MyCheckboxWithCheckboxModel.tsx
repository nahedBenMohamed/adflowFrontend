import { observer } from 'mobx-react-lite';
import { useCallback, type ChangeEventHandler } from 'react';
import type { CheckboxModel, MyCheckboxVariant } from '../../../models';
import { MyCheckbox } from './MyCheckbox';

interface Props {
  model: CheckboxModel;
  value?: unknown;
  disabled?: boolean;
  variant?: MyCheckboxVariant;
  handleChange?: (values: any[]) => void;
}

const MyCheckboxWithModel = observer((props: Props) => {
  const { value, model, disabled, variant, handleChange } = props;

  const checked = model.values.includes(value);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      let values = model.values;

      if (e.target.checked) {
        if (!values.includes(value)) values.push(value);
      } else {
        values = values.filter(item => item !== value);
      }

      model.setValues(values);

      handleChange?.(values);
    },
    [model, value, handleChange]
  );

  return (
    <MyCheckbox
      variant={variant}
      checked={checked}
      disabled={disabled}
      invalid={!model.isValid}
      onChange={onChange}
    />
  );
});

MyCheckboxWithModel.displayName = 'MyCheckboxWithModel';
export { MyCheckboxWithModel };
