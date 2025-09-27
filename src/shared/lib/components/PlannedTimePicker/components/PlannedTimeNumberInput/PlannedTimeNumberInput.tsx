import type { InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
  type Ref,
} from 'react';
import styled, { css } from 'styled-components';

interface RootProps {
  $focus: boolean;
  $minified: boolean;
}

const Root = styled.input<RootProps>`
  outline: none;
  caret-color: transparent;

  width: 32px;
  height: 36px;

  background: var(--graphite-graphite-20);
  border: 1px solid var(--graphite-graphite-80);
  border-radius: 2px;

  padding: 4px 0;

  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: var(--button-text-graphite-secondary-text);

  transition: border var(--transition-200);

  ${p => p.$focus && `border: 1px solid var(--button-text-graphite-secondary-text)`};

  ${p =>
    p.$minified &&
    css`
      width: 21px;
      height: 32px;

      font-size: 14px;
      line-height: 20px;
    `};

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
  canGoRight?: boolean;
  minutesFirstDigit?: boolean;
  minutesSeconds?: boolean;
  minified?: boolean;
  focusToLeft: () => void;
  focusToRight: () => void;
  handleChange: ChangeEventHandler<HTMLInputElement>;
}

const PlannedTimeNumberInput = observer((props: Props) => {
  const {
    ref,
    model,
    canGoRight = true,
    minutesFirstDigit = false,
    minified = false,
    focusToLeft,
    focusToRight,
    handleChange,
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      for (let i = 0; i < 10; i++) {
        const numericKey = i.toString();

        if (e.key === numericKey) {
          if (minutesFirstDigit && i > 5) {
            model.setValue('5');
            focusToRight();

            return;
          }

          model.setValue(numericKey);

          if (canGoRight) focusToRight();

          return;
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
    },
    [model, canGoRight, minutesFirstDigit, focusToRight, focusToLeft]
  );

  return (
    <Root
      ref={ref}
      type="number"
      $focus={isFocused}
      value={model.value}
      $minified={minified}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
});

PlannedTimeNumberInput.displayName = 'PlannedTimeNumberInput';
export { PlannedTimeNumberInput };
