import { observer } from 'mobx-react-lite';
import { useCallback, useId, useMemo } from 'react';
import styled from 'styled-components';
import type { BooleanModel } from '../../../../models';
import { MySwitch, type MySwitchSize } from '../MySwitch/MySwitch';

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
`;

const SwitchLabel = styled.label`
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  model: BooleanModel;
  size?: MySwitchSize;
  label?: string;
  inputId?: string;
  disabled?: boolean;
  inverted?: boolean;
  onChange?: (value: boolean) => void;
}

const MySwitchWithModel = observer((props: Props) => {
  const { model, size, label, inputId, disabled, inverted, onChange } = props;

  const id = useId();
  const switchId = useMemo<string>(() => inputId ?? id, [id, inputId]);

  const handleChange = useCallback(
    (value: boolean) => {
      const actualValue = inverted ? !value : value;

      model.setValue(actualValue);

      if (onChange) onChange?.(actualValue);
    },
    [model, inverted, onChange]
  );

  const checked = inverted ? !model.value : model.value;

  return (
    <SwitchWrapper>
      <MySwitch
        size={size}
        checked={checked}
        inputId={switchId}
        invalid={!model.isValid}
        disabled={disabled}
        onChange={handleChange}
      />

      {label && <SwitchLabel htmlFor={switchId}>{label}</SwitchLabel>}
    </SwitchWrapper>
  );
});

MySwitchWithModel.displayName = 'MySwitchWithModel';
export { MySwitchWithModel };
