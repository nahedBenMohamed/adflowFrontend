import type { InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ChangeEventHandler,
  type ReactNode,
} from 'react';
import styled, { css } from 'styled-components';

interface RootProps {
  $invalid: boolean;
  $withIcon?: boolean;
}

const Root = styled.div<RootProps>`
  position: relative;

  width: 100%;

  &::after {
    content: '';

    position: absolute;
    left: 0;
    right: 0;
    bottom: 1px;

    height: 1px;

    background-color: transparent;
    transition: var(--transition-200);
  }

  ${p =>
    !p.$invalid &&
    css`
      // so that we trigger the bottom border on child input focus and not any other element (e.g. button)
      &:focus-within:has(input:focus) {
        // to make input bottom border look bigger without changing it's width
        &::after {
          background-color: var(--primary-statuses-green-520);
        }
      }
    `}

  ${p =>
    p.$withIcon &&
    css`
      input {
        padding-right: 52px;
      }
    `}
`;

interface StyledInputProps {
  $invalid: boolean;
  $disabled?: boolean;
  $padding?: CSSProperties['padding'];
}

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;

  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
  color: var(--graphite-graphite-840);

  padding: 24px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  &::placeholder {
    color: var(--button-text-graphite-secondary-text);
    transition: var(--transition-200);
  }

  ${p =>
    p.$invalid
      ? `border-color: var(--button-text-red-hover);`
      : css`
          &:hover {
            color: var(--button-text-green-active);

            &::placeholder {
              color: var(--button-text-green-active);
            }
          }

          &:focus {
            color: var(--graphite-graphite-840);
            border-color: var(--primary-statuses-green-520);

            &::placeholder {
              color: var(--button-text-graphite-secondary-text);
            }
          }
        `}

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

  &:focus {
    outline: none;
  }

  padding: ${p => p.$padding};
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 24px;
  top: 50%;

  width: fit-content;
  height: fit-content;

  transform: translateY(-50%);
`;

interface Props {
  model: InputModel;
  placeholder: string;
  Icon?: ReactNode;
  padding?: CSSProperties['padding'];
  disabled?: boolean;
}

const GiantUnderlinedInput = observer((props: Props) => {
  const { model, placeholder, Icon, padding, disabled } = props;

  const [value, setValue] = useState(model.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value);
  }, [model.value]);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      const newValue = e.target.value;

      setValue(newValue);
      model.setValue(newValue);
    },
    [model]
  );

  const invalid = !model.isValid();

  return (
    <Root $withIcon={Boolean(Icon)} $invalid={invalid}>
      <StyledInput
        type="text"
        value={value}
        $invalid={invalid}
        $padding={padding}
        $disabled={disabled}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
      />

      {Icon && <IconWrapper>{Icon}</IconWrapper>}
    </Root>
  );
});

export { GiantUnderlinedInput };
