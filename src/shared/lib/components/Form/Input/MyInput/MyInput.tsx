import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useState,
  type AriaRole,
  type CSSProperties,
  type ChangeEventHandler,
  type FocusEvent,
  type FocusEventHandler,
  type HTMLInputTypeAttribute,
  type KeyboardEvent,
  type Ref,
} from 'react';
import styled from 'styled-components';
import type { InputModel, MyInputFontSize, MyInputVariant } from '../../../../models';
import { StyledInput, StyledInputWrapper } from '../components';
import { ErrorIcon, Loader, VisibilityIcon } from './components';

export interface MyInputProps {
  ref?: Ref<HTMLInputElement>;
  model: InputModel;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  placeholder?: string;
  hasBorderBottom?: boolean;
  hasBorderBottomLight?: boolean;
  fontSize?: MyInputFontSize;
  medium?: boolean;
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  type?: HTMLInputTypeAttribute;
  role?: AriaRole;
  maxLength?: number;
  activeBgColor?: boolean;
  hideNumberInputControls?: boolean;
  hasPaddingBottom?: boolean;
  alwaysActive?: boolean;
  variant?: MyInputVariant;
  textAlign?: CSSProperties['textAlign'];
  readonly?: boolean;
  hiddenlyDisabled?: boolean;
  whitespaceClearing?: boolean;
  disableAutocomplete?: boolean;
  handleChange?: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  validateValue?: (value: string) => boolean;
}

const ErrorMessage = styled.div`
  position: absolute;
  bottom: -16px;

  font-size: 11px;
  color: var(--button-text-red-hover);
`;

const MyInput = observer((props: MyInputProps) => {
  const {
    ref,
    model,
    width,
    height,
    placeholder = '...',
    hasBorderBottom = false,
    hasBorderBottomLight = false,
    loading = false,
    fontSize = 'normal',
    medium,
    disabled = false,
    autoFocus = false,
    type = 'text',
    role = 'textbox',
    maxLength,
    activeBgColor = false,
    hideNumberInputControls = false,
    alwaysActive = false,
    hasPaddingBottom = true,
    variant = 'primary',
    textAlign,
    readonly = false,
    hiddenlyDisabled,
    whitespaceClearing,
    disableAutocomplete,
    handleChange,
    onKeyDown,
    onBlur,
    onFocus,
    validateValue,
  } = props;

  const [value, setValue] = useState(model.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value);
  }, [model.value]);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      if (readonly || disabled) return;

      const newValue = e.target.value;

      if (validateValue && !validateValue(newValue)) return;

      setValue(newValue);
      model.setValue(newValue);

      handleChange?.(newValue);
    },
    [model, disabled, readonly, handleChange, validateValue]
  );

  const handleBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    e => {
      const newValue = e.target.value;

      if (whitespaceClearing) model.value = newValue.trim();

      onBlur?.(e);
    },
    [model, whitespaceClearing, onBlur]
  );

  const [isPasswordShown, { close: hidePassword, open: showPassword }] = useDisclosure(false);
  const isPassword = type === 'password';

  const errorMessageShown = Boolean(model.isErrorShown && model.errorMessage);

  return (
    <StyledInputWrapper
      $width={width}
      $height={height}
      $disabled={disabled}
      $hiddenlyDisabled={hiddenlyDisabled}
    >
      <StyledInput
        ref={ref}
        role={role}
        value={value}
        $width={width}
        $medium={medium}
        $variant={variant}
        $fontSize={fontSize}
        autoFocus={autoFocus}
        $textAlign={textAlign}
        maxLength={maxLength}
        placeholder={placeholder}
        $invalid={!model.isValid()}
        $alwaysActive={alwaysActive}
        $activeBgColor={activeBgColor}
        $hasBorderBottom={hasBorderBottom}
        $hasPaddingBottom={hasPaddingBottom}
        $hasBorderBottomLight={hasBorderBottomLight}
        $hideNumberInputControls={hideNumberInputControls}
        // https://stackoverflow.com/q/15738259/19103570
        // new-password is the only value that works to disable chrome autocomplete
        autoComplete={disableAutocomplete ? 'new-password' : undefined}
        type={!isPassword ? type : isPasswordShown ? 'text' : 'password'}
        $hasRightIcon={isPassword || loading || (errorMessageShown && variant === 'outlined')}
        onBlur={handleBlur}
        onFocus={onFocus}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      {errorMessageShown && variant !== 'outlined' && (
        <ErrorMessage>{model.errorMessage}</ErrorMessage>
      )}

      {isPassword && model.value.length > 0 && (
        <VisibilityIcon
          variant={variant}
          isPasswordShown={isPasswordShown}
          onClick={isPasswordShown ? hidePassword : showPassword}
        />
      )}

      {loading && <Loader variant={variant} />}

      {errorMessageShown && model.errorMessage && variant === 'outlined' && (
        <ErrorIcon errorMessage={model.errorMessage} />
      )}
    </StyledInputWrapper>
  );
});

MyInput.displayName = 'MyInput';
export { MyInput };
