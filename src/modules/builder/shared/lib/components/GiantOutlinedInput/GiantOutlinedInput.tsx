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

const Root = styled.div<{ $withIcon?: boolean }>`
  position: relative;

  width: 100%;

  ${p =>
    p.$withIcon &&
    css`
      input {
        padding-right: 40px;
      }
    `}
`;

interface StyledInputProps {
  $invalid: boolean;
  $smaller?: boolean;
  $disabled?: boolean;
  $padding?: CSSProperties['padding'];
}

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;

  ${p =>
    p.$smaller
      ? css`
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
        `
      : css`
          font-size: 20px;
          font-weight: 500;
          line-height: 28px;
        `}

  color: var(--graphite-graphite-840);

  border: 1px solid var(--graphite-graphite-120);
  border-radius: ${p =>
    p.$smaller ? 'var(--border-radius-element)' : 'var(--border-radius-block)'};
  padding: ${p => (p.$smaller ? '8px 12px' : '24px')};
  transition: var(--transition-200);

  ${p =>
    p.$invalid
      ? `border-color: var(--button-text-red-hover);`
      : css`
          &:hover,
          &:focus {
            border-color: var(--button-text-graphite-secondary-text);
          }
        `}

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--button-text-graphite-secondary-text);
  }

  padding: ${p => p.$padding};

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

const IconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;

  width: fit-content;
  height: fit-content;

  transform: translateY(-50%);
`;

interface Props {
  model: InputModel;
  placeholder: string;
  Icon?: ReactNode;
  smaller?: boolean;
  disabled?: boolean;
  padding?: CSSProperties['padding'];
}

const GiantOutlinedInput = observer((props: Props) => {
  const { model, placeholder, Icon, smaller, disabled, padding } = props;

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

  return (
    <Root $withIcon={Boolean(Icon)}>
      <StyledInput
        type="text"
        value={value}
        $smaller={smaller}
        $padding={padding}
        $disabled={disabled}
        placeholder={placeholder}
        $invalid={!model.isValid()}
        onChange={onChange}
      />

      {Icon && <IconWrapper>{Icon}</IconWrapper>}
    </Root>
  );
});

export { GiantOutlinedInput };
