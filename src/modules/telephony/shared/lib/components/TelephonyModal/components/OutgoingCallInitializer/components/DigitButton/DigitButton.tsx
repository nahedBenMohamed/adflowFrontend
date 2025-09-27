import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.button`
  outline: none;

  width: 56px;
  height: 56px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
  color: var(--button-text-graphite-primary-text);

  border-radius: 50%;
  padding: 14px 0 16px;
  border: 1px solid var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  &:active {
    scale: 0.9;
  }
`;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const DigitButton = memo((props: Props) => {
  const { children, ...rest } = props;

  return (
    <Root type="button" {...rest}>
      {children}
    </Root>
  );
});

DigitButton.displayName = 'DigitButton';
export { DigitButton };
