import type { InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import {
  FieldTextPrimitive,
  type FieldTextPrimitiveProps,
  type FieldTextPrimitiveRenderAs,
} from '../FieldTextPrimitive/FieldTextPrimitive';

interface Props<RenderAs extends FieldTextPrimitiveRenderAs>
  extends Omit<FieldTextPrimitiveProps<RenderAs>, 'value' | 'onChange'> {
  model: InputModel;
  onChange?: (value: string) => void;
}

const FieldTextInput = observer(
  <RenderAs extends FieldTextPrimitiveRenderAs = 'input'>(props: Props<RenderAs>) => {
    const { model, onChange, ...rest } = props;

    const [value, setValue] = useState<string>(model.value);

    const handleChange = useCallback(
      ({ target: { value } }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        model.setValue(value);
        setValue(value);

        onChange?.(value);
      },
      [model, onChange]
    );

    useEffect(() => {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setValue(model.value);
    }, [model.value]);

    return (
      <FieldTextPrimitive
        {...rest}
        value={value}
        invalid={!model.isValid()}
        onChange={handleChange}
      />
    );
  }
);

FieldTextInput.displayName = 'FieldTextInput';
export { FieldTextInput };
