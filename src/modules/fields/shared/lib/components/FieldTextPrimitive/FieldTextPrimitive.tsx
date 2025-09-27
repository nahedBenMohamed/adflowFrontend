import {
  MiniLoader,
  TruncateMixin,
  currencyFormatterHelper,
  setCaretToPos,
  type Currency,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import {
  useCallback,
  useMemo,
  useRef,
  type CSSProperties,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { flushSync } from 'react-dom';
import ReactTextareaAutosize, { type TextareaAutosizeProps } from 'react-textarea-autosize';
import styled, { css, keyframes, type Keyframes } from 'styled-components';
import { EditTextIcon } from '../../../assets';

interface RootProps {
  $editMode: boolean;
  $placeholderShown: boolean;
  $alignItemsCenter: boolean;
  $maxWidth: CSSProperties['maxWidth'];
}

const Root = styled.div<RootProps>`
  min-height: var(--field-component-height);
  ${p =>
    p.$maxWidth
      ? css`
          max-width: ${p.$maxWidth};

          ${Content} {
            max-width: ${p.$maxWidth};
          }
        `
      : `max-width: 100%`};
  width: ${p => (p.$editMode ? '100%' : p.$placeholderShown ? '100%' : 'fit-content')};

  display: flex;
  gap: 16px;

  ${p => p.$alignItemsCenter && `align-items: center`};

  ${TruncateMixin}
`;

const EditTextIconWrapper = styled.div`
  position: absolute;
  top: 6px;
  right: 8px;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  pointer-events: none;

  svg {
    scale: 0;
    opacity: 0;
    transition: var(--transition-200);
  }
`;

const LoaderWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 10px;

  width: 12px;
  height: 12px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  pointer-events: none;
`;

interface ContentProps {
  $placeholderShown: boolean;
  $loading?: boolean;
  $disabled?: boolean;
}

const Content = styled.div<ContentProps>`
  position: relative;

  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;

  ${p => p.$disabled && `pointer-events: none`};

  ${p =>
    p.$loading &&
    css`
      ${EditTextIconWrapper} {
        display: none;
      }
    `}

  ${TruncateMixin}
`;

const CommonStyles = css`
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  line-height: 18px;
  font-variant: tabular-nums;
  color: var(--graphite-graphite-840);

  padding: 4px 32px 4px 8px;
  border: 1px solid transparent;
  border-radius: var(--border-radius-element);

  transition-property: border-color, box-shadow, color;
  transition-duration: var(--transition-duration);
  transition-timing-function: var(--transition-timing-function);

  &:focus {
    outline: none;
  }

  &:hover,
  &:focus {
    border-color: var(--button-text-graphite-secondary-text);
  }

  &:hover + ${EditTextIconWrapper} svg {
    scale: 1;
    opacity: 1;
  }

  &:focus + ${EditTextIconWrapper} svg {
    scale: 1;
    opacity: 1;
  }
`;

interface ValueProps {
  $placeholderShown: boolean;
  $renderAs: FieldTextPrimitiveRenderAs;
  $lineClamp: CSSProperties['lineClamp'];
  $invalid?: boolean;
}

const Value = styled.div<ValueProps>`
  ${CommonStyles}

  max-width: 100%;
  ${p => p.$placeholderShown && `width: 100%`};

  color: ${p => p.$placeholderShown && 'var(--button-text-graphite-secondary-text)'};

  &:hover {
    color: ${p => p.$placeholderShown && 'var(--button-text-graphite-priory-text)'};
  }

  ${p =>
    p.$renderAs === 'textarea'
      ? css`
          min-height: 28px;

          white-space: pre-wrap;
          word-break: break-word;

          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: ${p.$lineClamp ?? 4};
          overflow: hidden;

          // to prevent minor clipped text from being in the view
          padding-bottom: 3px;

          & + ${EditTextIconWrapper} {
            top: 8px;
          }
        `
      : css`
          height: 28px;

          ${TruncateMixin}
        `}

  &:hover {
    cursor: pointer;
  }

  ${p =>
    p.$invalid &&
    css`
      border-color: var(--button-text-red-hover);

      &:hover {
        border-color: var(--button-text-red-hover);
      }
    `};
`;

const getInputAppearanceAnimation = (noShadow?: boolean): Keyframes =>
  keyframes`
  to {
    border-color: var(--button-text-green-active);
    box-shadow: ${noShadow ? 'none' : '1px 1px 6px 0px var(--button-text-green-default)'};
  }
`;

interface InputStylesProps {
  $invalid?: boolean;
  $noActiveShadow?: boolean;
}

const InputStyles = css<InputStylesProps>`
  outline: none;

  width: 100%;

  &:focus + ${EditTextIconWrapper} svg {
    scale: 0;
    opacity: 0;
  }

  &:focus {
    &::placeholder {
      color: transparent;
    }
  }

  ${p =>
    p.$invalid
      ? css`
          && {
            box-shadow: none;
            border-color: var(--primary-statuses-red-360);
          }
        `
      : css`
          animation: ${getInputAppearanceAnimation(p.$noActiveShadow)} var(--transition-200);
          animation-fill-mode: forwards;
        `};
`;

const StyledInput = styled.input<InputStylesProps>`
  height: 28px;

  ${CommonStyles}

  ${InputStyles}

  // to prevent weird text position change when value to input
  padding-bottom: 5px;

  &[type='number'] {
    // hide arrows
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    // hide arrows in Firefox
    -moz-appearance: textfield !important;
    appearance: textfield;
  }
`;

const StyledTextarea = styled(ReactTextareaAutosize)<InputStylesProps>`
  resize: none;

  ${CommonStyles}

  ${InputStyles}

  overflow-x: hidden;

  ::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #aab7d442;
    border-radius: var(--border-radius-block);
    border: 2px solid var(--primary-statuses-white-0);
    transition: var(--transition-200);

    &:hover {
      background: #aab7d45f;
    }
  }
`;

const ControlsWrapper = styled.div`
  height: fit-content;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
`;

export type FieldTextPrimitiveRenderAs = 'input' | 'textarea';

export interface FieldTextPrimitiveProps<RenderAs extends FieldTextPrimitiveRenderAs> {
  value: string;
  // user when value in view mode differs from value in edit mode
  displayValue?: string;
  invalid?: boolean;
  renderAs?: RenderAs;
  currency?: Currency;
  Controls?: ReactNode;
  placeholder?: string;
  noActiveShadow?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  maxWidth?: CSSProperties['maxWidth'];
  lineClamp?: CSSProperties['lineClamp'];
  maxRows?: number;
  readonly?: boolean;
  disableAutocomplete?: boolean;
  loading?: boolean;
  onEnter?: () => void;
  onChange?: RenderAs extends 'input'
    ? ChangeEventHandler<HTMLInputElement>
    : ChangeEventHandler<HTMLTextAreaElement>;
}

const FieldTextPrimitive = <RenderAs extends FieldTextPrimitiveRenderAs = 'input'>(
  props: FieldTextPrimitiveProps<RenderAs>
) => {
  const {
    value,
    displayValue,
    invalid,
    maxWidth,
    Controls,
    currency,
    noActiveShadow,
    type = 'text',
    renderAs = 'input',
    placeholder = '...',
    lineClamp = 4,
    maxRows = 12,
    readonly,
    disableAutocomplete,
    loading,
    onEnter,
    onChange,
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [editMode, { open: showEditMode, close: hideEditMode }] = useDisclosure(false);

  const placeholderShown = !value;

  const handleShowEditMode = useCallback(() => {
    flushSync(() => {
      showEditMode();
    });

    const textareaElement = textareaRef.current;

    // we need this workaround due to invalid behavior of ReactTextareaAutosize autoFocus,
    // it puts cursor at the beginning of the text, but we need to put it at the end
    if (renderAs === 'textarea' && textareaElement && typeof value === 'string')
      setCaretToPos({ textarea: textareaElement, pos: value.length });
  }, [renderAs, value, showEditMode]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if ((e.key === 'Enter' && renderAs !== 'textarea') || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();

        hideEditMode();
        onEnter?.();
      }
    },
    [renderAs, hideEditMode, onEnter]
  );

  const commonProps = useMemo(
    () =>
      ({
        type,
        value,
        placeholder,
        $invalid: invalid,
        $noActiveShadow: noActiveShadow,
        onBlur: hideEditMode,
        onKeyDown: handleKeyDown,
      }) satisfies InputHTMLAttributes<HTMLInputElement> & TextareaAutosizeProps & InputStylesProps,
    [placeholder, value, type, invalid, noActiveShadow, handleKeyDown, hideEditMode]
  );

  const numberValue = Number(value);

  const currentValue = currency
    ? currencyFormatterHelper.format({ value: isNaN(numberValue) ? 0 : numberValue, currency })
    : displayValue || value || placeholder;

  return (
    <Root
      $maxWidth={maxWidth}
      $editMode={editMode}
      $placeholderShown={placeholderShown}
      $alignItemsCenter={renderAs === 'input'}
    >
      <Content $placeholderShown={placeholderShown} $disabled={readonly} $loading={loading}>
        {editMode ? (
          renderAs === 'input' ? (
            <StyledInput
              autoFocus
              {...commonProps}
              // https://stackoverflow.com/q/15738259/19103570
              // new-password is the only value that works to disable chrome autocomplete
              autoComplete={disableAutocomplete ? 'new-password' : undefined}
              onChange={onChange as ChangeEventHandler<HTMLInputElement>}
            />
          ) : (
            <StyledTextarea
              ref={textareaRef}
              minRows={1}
              maxRows={maxRows}
              {...commonProps}
              onChange={onChange as ChangeEventHandler<HTMLTextAreaElement>}
            />
          )
        ) : (
          <Value
            $invalid={invalid}
            $renderAs={renderAs}
            $lineClamp={lineClamp}
            $placeholderShown={placeholderShown}
            title={placeholderShown ? undefined : renderAs === 'input' ? currentValue : undefined}
            onClick={handleShowEditMode}
          >
            {currentValue}
          </Value>
        )}

        <EditTextIconWrapper>
          <EditTextIcon />
        </EditTextIconWrapper>

        {loading && (
          <LoaderWrapper>
            <MiniLoader size="small" color="var(--primary-statuses-green-520)" />
          </LoaderWrapper>
        )}
      </Content>

      {Controls && !editMode && <ControlsWrapper>{Controls}</ControlsWrapper>}
    </Root>
  );
};

export { FieldTextPrimitive };
