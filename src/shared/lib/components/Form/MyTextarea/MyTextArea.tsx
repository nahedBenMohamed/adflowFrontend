import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ChangeEventHandler,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type Ref,
} from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import styled, { css } from 'styled-components';
import { HideScrollbarMixin } from '../../../mixins';
import type { InputModel, MyInputVariant } from '../../../models';
import { MiniLoader } from '../../Loaders/MiniLoader/MiniLoader';

const Root = styled.div<{ $hiddenlyDisabled?: boolean }>`
  position: relative;

  width: 100%;

  ${p => p.$hiddenlyDisabled && `pointer-events: none`};
`;

const LoaderWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 12px;
`;

interface StyledTextAreaProps {
  $loading: boolean;
  $hasBorderBottomLight: boolean;
  variant: MyInputVariant;
  $invalid: boolean;
  $hasActiveState: boolean;
  $hasErrorState: boolean;
  $backgroundColor?: string;
  $borderRadius?: string;
  $alwaysActive?: boolean;
  $padding?: CSSProperties['padding'];
  $fontSize?: string;
  $fontFamily?: CSSProperties['fontFamily'];
}

const StyledTextArea = styled(ReactTextareaAutosize)<StyledTextAreaProps>`
  border: none;
  resize: none;
  outline: none;
  margin: 0;

  width: 100%;

  font-family: ${p => p.$fontFamily};
  color: var(--button-text-graphite-priory-text);

  padding: ${p => p.$padding ?? '0 0 3px'};
  border-radius: ${p => p.$borderRadius ?? 0};
  background: ${p => p.$backgroundColor ?? 'transparent'};
  border-bottom: 1px solid
    ${p => (p.$alwaysActive ? 'var(--button-text-green-hover)' : 'transparent')};
  border-bottom-color: ${p =>
    p.$hasBorderBottomLight ? 'var(--graphite-graphite-200)' : 'transparent'};
  transition: border var(--transition-200);

  ${p =>
    p.variant === 'filled' &&
    css`
      padding: ${p.$padding || '4px 8px'};
      border-radius: var(--border-radius-element);
      background: ${p.$backgroundColor ?? '#f8fafbd7'};
      border: 1px solid ${p.$invalid ? 'var(--button-text-red-hover)' : 'transparent'};
    `}

  ${p =>
    p.variant === 'outlined' &&
    css`
      color: var(--button-text-graphite-priory-text);

      padding: 4px 8px;
      border-radius: var(--border-radius-element);
      border: 1px solid
        ${p.$invalid ? 'var(--button-text-red-hover)' : 'var(--graphite-graphite-120)'};

      &:focus,
      &:hover {
        ${!p.$invalid && `border-color: var(--button-text-graphite-secondary-text)`};
      }
    `}

  ${p => p.$loading && `padding-right: 24px`};

  ${p => {
    switch (p.$fontSize) {
      case 'large':
        return css`
          font-weight: 600;
          font-size: 22px;
          line-height: 26px;
        `;

      case 'medium':
        return css`
          font-size: 14px;
          font-weight: 400;
          line-height: 18px;
        `;
    }
  }}

  &:focus,
  &:hover {
    box-shadow: none;

    ${p => p.variant === 'primary' && `border-bottom: 1px solid var(--primary-statuses-green-520)`};
  }

  ${p => p.$invalid && p.$hasErrorState && `border-bottom: 1px solid var(--button-text-red-hover)`};

  &::placeholder {
    color: var(--button-text-graphite-secondary-text);
  }

  ${p =>
    !p.$hasActiveState &&
    css`
      border: none;

      &:hover {
        border: none;
      }

      &:focus {
        border: none;
      }
    `}

  ${HideScrollbarMixin}
`;

type FontSize = 'medium' | 'large';

interface MyTextAreaProps {
  ref?: Ref<HTMLTextAreaElement>;
  model: InputModel;
  minRows?: number;
  maxRows?: number;
  loading?: boolean;
  autoFocus?: boolean;
  fontSize?: FontSize;
  placeholder?: string;
  borderRadius?: string;
  alwaysActive?: boolean;
  hasErrorState?: boolean;
  variant?: MyInputVariant;
  backgroundColor?: string;
  hasActiveState?: boolean;
  hiddenlyDisabled?: boolean;
  disableAutocomplete?: boolean;
  hasBorderBottomLight?: boolean;
  padding?: CSSProperties['padding'];
  fontFamily?: CSSProperties['fontFamily'];
  handleChange?: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
}

const MyTextArea = observer((props: MyTextAreaProps) => {
  const {
    ref,
    model,
    maxRows,
    minRows = 1,
    loading = false,
    autoFocus = false,
    fontSize = 'medium',
    placeholder = '...',
    borderRadius,
    alwaysActive = false,
    hasErrorState = true,
    variant = 'primary',
    backgroundColor,
    hasActiveState = true,
    hiddenlyDisabled,
    disableAutocomplete = false,
    hasBorderBottomLight = false,
    padding,
    fontFamily,
    handleChange,
    onBlur,
    onFocus,
    onKeyDown,
  } = props;

  const [value, setValue] = useState(model.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value);
  }, [model.value]);

  const onChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    e => {
      const newValue = e.target.value;

      setValue(newValue);
      model.setValue(newValue);

      handleChange?.(newValue);
    },
    [model, handleChange, setValue]
  );

  return (
    <Root $hiddenlyDisabled={hiddenlyDisabled}>
      <StyledTextArea
        ref={ref}
        value={value}
        rows={minRows}
        maxRows={maxRows}
        minRows={minRows}
        variant={variant}
        $loading={loading}
        $padding={padding}
        $fontSize={fontSize}
        autoFocus={autoFocus}
        $fontFamily={fontFamily}
        placeholder={placeholder}
        $invalid={!model.isValid()}
        $alwaysActive={alwaysActive}
        $borderRadius={borderRadius}
        $hasErrorState={hasErrorState}
        $hasActiveState={hasActiveState}
        $backgroundColor={backgroundColor}
        $hasBorderBottomLight={hasBorderBottomLight}
        // new-password is the only value that works to disable chrome autocomplete
        autoComplete={disableAutocomplete ? 'new-password' : undefined}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      {loading && (
        <LoaderWrapper>
          <MiniLoader color="var(--primary-statuses-green-520)" />
        </LoaderWrapper>
      )}
    </Root>
  );
});

MyTextArea.displayName = 'MyTextArea';
export { MyTextArea };
