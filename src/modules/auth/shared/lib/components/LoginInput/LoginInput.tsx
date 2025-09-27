import type { InputModel } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import {
  useEffect,
  useState,
  type ChangeEvent,
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes,
} from 'react';
import styled from 'styled-components';
import { HidePasswordIcon, ShowPasswordIcon } from '../../../assets';

const InputRoot = styled.div`
  position: relative;
`;

interface InputProps {
  $invalid: boolean;
  $password: boolean;
}

const Input = styled.input<InputProps>`
  width: 100%;
  height: 48px;

  font-size: 16px;
  line-height: 28px;
  font-family: Nunito;
  color: var(--graphite-graphite-840);

  border-radius: var(--border-radius-block);
  border: 1px solid var(--button-text-graphite-secondary-text);
  padding: ${p => (p.$password ? '12px 40px 12px 16px' : '12px 16px')};
  transition: border var(--transition-200);

  &::placeholder {
    color: var(--graphite-graphite-200);
  }

  ${p => p.$invalid && `border-color: var(--button-text-red-default)`};
`;

const ErrorMessage = styled.div`
  position: absolute;

  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  font-family: Nunito;
  color: var(--button-text-red-default);

  padding-left: 8px;
  transform: translateY(2px);
`;

const VisibilityIconWrapper = styled.button`
  position: absolute;
  top: 14px;
  right: 12px;

  width: 24px;
  height: 24px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  model: InputModel;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
}

const LoginInput = observer((props: Props) => {
  const { model, placeholder, type = 'text', ...rest } = props;

  const [value, setValue] = useState(model.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value);
  }, [model.value]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setValue(newValue);
    model.setValue(newValue);
  };

  const [isPasswordShown, { toggle: togglePasswordShown }] = useDisclosure(false);
  const isPassword = type === 'password';

  return (
    <InputRoot>
      <Input
        {...rest}
        value={value}
        $password={isPassword}
        placeholder={placeholder}
        $invalid={!model.isValid()}
        type={!isPassword ? type : isPasswordShown ? 'text' : 'password'}
        onChange={onChange}
      />

      {!model.isValid() && model.isErrorShown && <ErrorMessage>{model.errorMessage}</ErrorMessage>}

      {isPassword && (
        <VisibilityIconWrapper type="button" onClick={togglePasswordShown}>
          {isPasswordShown ? <HidePasswordIcon /> : <ShowPasswordIcon />}
        </VisibilityIconWrapper>
      )}
    </InputRoot>
  );
});

export { LoginInput };
