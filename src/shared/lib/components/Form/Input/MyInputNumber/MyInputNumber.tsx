import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEventHandler,
  type Ref,
} from 'react';
import type { MyInputFontSize, MyInputVariant, NumberModel } from '../../../../models';
import type { Nullable } from '../../../../types';
import { StyledInput, StyledInputWrapper } from '../components';

interface Props {
  ref?: Ref<HTMLInputElement>;
  model: NumberModel;
  placeholder?: string;
  hasBorderBottom?: boolean;
  hasBorderBottomLight?: boolean;
  fontSize?: MyInputFontSize;
  medium?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  hasPaddingBottom?: boolean;
  alwaysActive?: boolean;
  variant?: MyInputVariant;
  textAlign?: CSSProperties['textAlign'];
  disabled?: boolean;
  hiddenlyDisabled?: boolean;
  width?: CSSProperties['width'];
  padding?: CSSProperties['padding'];
  height?: CSSProperties['height'];
  min?: number;
  max?: number;
  handleChange?: (value: Nullable<number>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onClick?: MouseEventHandler<HTMLInputElement>;
}

const MyInputNumber = observer((props: Props) => {
  const {
    ref,
    model,
    width,
    height,
    placeholder,
    hasBorderBottom = false,
    hasBorderBottomLight = false,
    fontSize = 'normal',
    medium,
    invalid,
    autoFocus = false,
    alwaysActive = false,
    hasPaddingBottom = true,
    variant = 'primary',
    disabled = false,
    textAlign,
    hiddenlyDisabled,
    min,
    max,
    handleChange,
    onKeyDown,
    onBlur,
    onFocus,
    onClick,
  } = props;

  const [value, setValue] = useState<Nullable<number>>(model.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value!);
  }, [model.value]);

  const onChange = useCallback(
    ({ target: { value: targetValue } }: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(targetValue);
      const newValue = isNaN(value) ? null : value;

      setValue(newValue);
      model.setValue(newValue);

      handleChange?.(newValue);
    },
    [model, handleChange]
  );

  return (
    <StyledInputWrapper
      $width={width}
      $height={height}
      $disabled={disabled}
      $hiddenlyDisabled={hiddenlyDisabled}
    >
      <StyledInput
        ref={ref}
        min={min}
        max={max}
        type="number"
        $width={width}
        role="textbox"
        $medium={medium}
        $variant={variant}
        $fontSize={fontSize}
        $invalid={invalid}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        $textAlign={textAlign}
        aria-invalid={invalid}
        $hideNumberInputControls
        placeholder={placeholder}
        $alwaysActive={alwaysActive}
        $hasBorderBottom={hasBorderBottom}
        $hasPaddingBottom={hasPaddingBottom}
        $hasBorderBottomLight={hasBorderBottomLight}
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={onClick}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </StyledInputWrapper>
  );
});

MyInputNumber.displayName = 'MyInputNumber';
export { MyInputNumber };
