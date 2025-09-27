import type { InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
  type Ref,
} from 'react';
import styled, { css } from 'styled-components';

const Root = styled.input<{ $invalid: boolean }>`
  width: 100%;
  height: 36px;

  outline: none;
  background-color: transparent;

  width: 100%;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-120);
  background-color: var(--primary-statuses-white-0);
  transition: var(--transition-200);

  ${p => p.$invalid && `border-color: var(--button-text-red-hover)`};

  ${p =>
    !p.$invalid &&
    css`
      &:not(:focus):hover {
        border-color: var(--button-text-graphite-secondary-text);
      }

      &:focus {
        border-color: var(--button-text-green-active);
        box-shadow: 1px 1px 6px 0px var(--button-text-green-default);
      }
    `}

  &:disabled {
    pointer-events: none;

    opacity: 0.6;
    border-color: var(--button-text-graphite-secondary-text);
  }

  &::placeholder {
    color: var(--button-text-graphite-secondary-text);
  }
`;

interface Props {
  ref?: Ref<HTMLInputElement>;
  model: InputModel;
  placeholder?: string;
  handleChange?: (name: string) => void;
  handleSaveOnEnter?: () => void;
}

const TutorialGroupItemFormInput = observer((props: Props) => {
  const { ref, model, placeholder, handleChange, handleSaveOnEnter } = props;

  const [value, setValue] = useState(model.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value);
  }, [model.value]);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      const { value } = e.target;

      setValue(value);
      model.setValue(value);

      handleChange?.(value);
    },
    [model, handleChange]
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      if (e.key === 'Enter') handleSaveOnEnter?.();
    },
    [handleSaveOnEnter]
  );

  return (
    <Root
      ref={ref}
      value={value}
      placeholder={placeholder}
      $invalid={!model.isValid()}
      onChange={onChange}
      onKeyDown={handleKeyDown}
    />
  );
});

TutorialGroupItemFormInput.displayName = 'TutorialGroupItemFormInput';
export { TutorialGroupItemFormInput };
