import { useCallback, type ChangeEventHandler, type Ref } from 'react';
import styled from 'styled-components';
import { ClearCrossIcon, SearchIcon } from '../../../../../assets';

const Root = styled.div`
  position: relative;

  width: 100%;
`;

const SearchIconWrapper = styled.div`
  position: absolute;

  top: 8px;
  left: 12px;

  width: 16px;
  height: 18px;

  z-index: 1;

  svg path {
    transition: var(--transition-200);
  }
`;

const ClearIconWrapper = styled.button<{ $visible: boolean }>`
  position: absolute;
  top: 10px;
  right: 12px;

  width: 16px;
  height: 16px;

  z-index: 1;

  scale: ${p => (p.$visible ? 1 : 0)};
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: var(--transition-200);

  svg path {
    fill: var(--button-text-graphite-secondary-text);
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

const StyledInput = styled.input`
  outline: none;

  width: 100%;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px 32px;
  border-radius: 24px;
  border: 1px solid var(--graphite-graphite-200);
  transition: var(--transition-200);

  &:focus,
  &:hover {
    border-color: var(--primary-statuses-green-520);
  }

  &:disabled {
    opacity: 0.8;

    pointer-events: none;
  }

  &::placeholder {
    color: var(--button-text-graphite-secondary-text);
  }
`;

export interface OutlinedSearchInputProps {
  ref?: Ref<HTMLDivElement>;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  handleChange: (value: string) => void;
}

const OutlinedSearchInput = (props: OutlinedSearchInputProps) => {
  const { ref, value, placeholder, disabled, handleChange } = props;

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => handleChange(e.target.value),
    [handleChange]
  );

  return (
    <Root ref={ref}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>

      <StyledInput
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
      />

      <ClearIconWrapper $visible={Boolean(value.trim().length)} onClick={() => handleChange('')}>
        <ClearCrossIcon />
      </ClearIconWrapper>
    </Root>
  );
};

export { OutlinedSearchInput };
