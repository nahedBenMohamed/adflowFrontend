import type { InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useState, type Dispatch, type KeyboardEvent, type Ref, type SetStateAction } from 'react';
import styled, { css } from 'styled-components';

interface RootProps {
  $focus: boolean;
  $minified: boolean;
}

const Root = styled.input<RootProps>`
  padding: 0;

  outline: none;
  caret-color: transparent;

  width: 20px;
  height: 20px;

  background-color: inherit;
  border-bottom: 1px solid var(--graphite-graphite-80);

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: inherit;
  text-align: center;

  transition: border 150ms ease;

  ${p =>
    p.$focus &&
    css`
      border-bottom: 1px solid var(--button-text-green-default);
    `};

  &.input {
    padding: 0;
  }

  // hide arrows
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  // hide arrows in Firefox
  -moz-appearance: textfield !important;
  appearance: textfield;
`;

interface Props {
  ref?: Ref<HTMLInputElement>;
  model: InputModel;
  hour?: boolean;
  minutesSeconds?: boolean;
  minified?: boolean;
  focusToRight: () => void;
  focusToLeft: () => void;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}

const DoubleDigitNumberInput = observer((props: Props) => {
  const {
    ref,
    model,
    hour = false,
    minified = false,
    focusToRight,
    focusToLeft,
    setEnabled,
  } = props;

  const [isFirstDigit, setIsFirstDigit] = useState(true);

  const handleKeyDown = (e: KeyboardEvent) => {
    for (let i = 0; i < 10; i++) {
      const numericKey = i.toString();

      if (e.key === numericKey) {
        if (isFirstDigit) {
          if (!hour && i > 5) {
            model.setValue('59');

            return;
          }

          model.setValue(`0${numericKey}`);
          setIsFirstDigit(false);

          return;
        } else {
          model.setValue(`${model.value[1]}${numericKey}`);
          setIsFirstDigit(true);

          return;
        }
      }
    }

    switch (e.key) {
      case 'ArrowLeft': {
        focusToLeft();

        break;
      }

      case 'ArrowRight': {
        focusToRight();

        break;
      }

      default:
        model.setValue('0');
    }
  };

  const handleSelect = () => {
    model.setValue('');
    setIsFirstDigit(true);
  };

  const [isFocused, setIsFocused] = useState(false);

  return (
    <Root
      ref={ref}
      type="number"
      value={model.value}
      onKeyDown={handleKeyDown}
      onChange={() => {}}
      onSelect={handleSelect}
      $focus={isFocused}
      onFocus={() => {
        setIsFocused(true);
        setEnabled(true);
      }}
      onBlur={() => {
        setIsFocused(false);

        if (Number(model.value) <= 0) model.setValue('00');
      }}
      $minified={minified}
    />
  );
});

export { DoubleDigitNumberInput };
