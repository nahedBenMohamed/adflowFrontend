import { observer } from 'mobx-react-lite';
import { useCallback, type ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, keyframes } from 'styled-components';
import type { InputModel, MyRadioColorType } from '../../../models';
import type { Optional } from '../../../types';

const check = keyframes`
  0% {
    transform: scale(0.85);
  }

  50% {
    transform: scale(1.015);
  }

  100% {
    transform: scale(1);
  }

`;

interface RadioProps {
  $margin?: string;
  $bigger?: boolean;
  $disabled?: boolean;
  $colorType?: MyRadioColorType;
}

const Radio = styled.input<RadioProps>`
  outline: none;
  appearance: none;
  -webkit-appearance: none;

  width: ${p => (p.$bigger ? 20 : 16)}px;
  height: ${p => (p.$bigger ? 20 : 16)}px;

  flex-shrink: 0;

  border-radius: 50%;
  border: 1px solid var(--button-text-graphite-secondary-text);
  background-color: var(--graphite-graphite-20);

  &:hover {
    cursor: pointer;
  }

  &:checked {
    border: 3px solid
      ${p => {
        switch (p.$colorType) {
          case 'default':
            return 'var(--button-text-green-default)';

          case 'danger':
            return 'var(--button-text-red-default)';

          case 'success':
            return 'var(--button-text-green-default)';

          case 'gray':
            return 'var(--button-text-graphite-secondary-text)';
        }
      }};

    animation: ${check} var(--transition-200);
  }

  ${p =>
    p.$disabled &&
    css`
      cursor: default;

      opacity: 0.5;
      background-color: var(--primary-statuses-white-0);

      &:hover {
        cursor: default;
      }
    `}
`;

export interface MyRadioProps {
  model: InputModel;
  disabled?: boolean;
  colorType?: MyRadioColorType;
  value?: Optional<string | number>;
  bigger?: boolean;
  handleChange?: (value: string) => void;
}

const emptyCallback = () => {};

const MyRadio = observer((props: MyRadioProps) => {
  const { model, disabled, colorType = 'default', value, bigger, handleChange } = props;

  const { t } = useTranslation();

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      model.setValue(e.target.value);

      handleChange?.(e.target.value);
    },
    [model, handleChange]
  );

  return (
    <Radio
      type="radio"
      role="radio"
      value={value}
      $bigger={bigger}
      readOnly={disabled}
      $disabled={disabled}
      $colorType={colorType}
      checked={model.value === value}
      title={disabled ? t('field_readonly') : undefined}
      onChange={disabled ? emptyCallback : onChange}
    />
  );
});

MyRadio.displayName = 'MyRadio';
export { MyRadio };
