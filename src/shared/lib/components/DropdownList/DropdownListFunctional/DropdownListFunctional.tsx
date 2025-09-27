import { useCallback, type ReactNode } from 'react';
import styled, { css } from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;

  padding: 6px 0;
`;

const Option = styled.div<{ $danger?: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 6px 12px;
  white-space: nowrap;
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: #f3fded;

    ${p =>
      p.$danger &&
      css`
        color: var(--button-text-red-hover);

        svg path {
          fill: var(--button-text-red-hover);
        }
      `}
  }

  &:active {
    background-color: #e6fbda;

    ${p =>
      p.$danger &&
      css`
        color: var(--button-text-red-active);

        svg path {
          fill: var(--button-text-red-active);
        }
      `}
  }
`;

export interface FunctionalOptionWithComponent {
  label: ReactNode;
  danger?: boolean;
  value: (...args: unknown[]) => void;
}

interface Props {
  options: FunctionalOptionWithComponent[];
  hideDropdown: () => void;
}

const DropdownListFunctional = (props: Props) => {
  const { options, hideDropdown } = props;

  const handleClick = useCallback(
    (func: (...args: any[]) => void) => () => {
      func();
      hideDropdown();
    },
    [hideDropdown]
  );

  return (
    <Root>
      {options.map((o, idx) => (
        <Option key={idx} $danger={o.danger} onClick={handleClick(o.value)}>
          {o.label}
        </Option>
      ))}
    </Root>
  );
};

export { DropdownListFunctional };
