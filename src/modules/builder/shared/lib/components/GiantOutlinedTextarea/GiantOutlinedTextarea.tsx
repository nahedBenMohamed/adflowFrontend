import { DropdownScrollbarMixin, type InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEventHandler,
  type CSSProperties,
} from 'react';
import ReactTextareaAutosize, { type TextareaAutosizeProps } from 'react-textarea-autosize';
import styled, { css } from 'styled-components';

interface StyledTextareaProps {
  $invalid?: boolean;
  $disabled?: boolean;
  $padding?: CSSProperties['padding'];
}

const StyledTextarea = styled(ReactTextareaAutosize)<StyledTextareaProps>`
  resize: none;
  outline: none;
  margin: 0;

  width: 100%;

  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);

  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-120);
  transition:
    color var(--transition-200),
    border-color var(--transition-200),
    background-color var(--transition-200);

  ${p =>
    p.$invalid
      ? `border-color: var(--button-text-red-hover);`
      : css`
          &:hover,
          &:focus {
            border-color: var(--button-text-graphite-secondary-text);
          }
        `}

  &::placeholder {
    color: var(--button-text-graphite-secondary-text);
  }

  ${DropdownScrollbarMixin}

  padding: ${p => p.$padding ?? '24px 32px'};

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      color: transparent;

      background-color: var(--graphite-graphite-20);

      &::placeholder {
        color: transparent;
      }
    `};
`;

interface Props extends TextareaAutosizeProps {
  model: InputModel;
  disabled?: boolean;
  placeholder?: string;
  padding?: CSSProperties['padding'];
}

const GiantOutlinedTextarea = observer((props: Props) => {
  const { model, disabled, placeholder, padding, ...rest } = props;

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
    },
    [model]
  );

  return (
    <StyledTextarea
      {...rest}
      value={value}
      $padding={padding}
      $disabled={disabled}
      placeholder={placeholder}
      $invalid={!model.isValid()}
      onChange={onChange}
    />
  );
});

export { GiantOutlinedTextarea };
