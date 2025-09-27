import { useWindowEvent } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useRef, useState, type ChangeEvent, type FocusEvent, type FocusEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { ClearIcon, SearchIcon } from '../../../../../assets';
import type { InputModel } from '../../../../models';
import { Loader } from '../MyInput/components';

const Root = styled.div`
  position: relative;

  width: 100%;

  &:hover input {
    background: var(--graphite-graphite-40);
  }

  &:active input {
    background: var(--graphite-graphite-80);
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 8px;
  top: 50%;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: translateY(-50%);
`;

const StyledInput = styled.input<{ $focused: boolean }>`
  width: 100%;
  height: 32px;

  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;

  border-radius: 16px;
  padding: 4px 16px 4px 32px;
  box-shadow: inset 0 0 0 1px var(--graphite-graphite-80);
  background: var(--primary-statuses-white-0);
  transition: var(--transition-200);

  &:focus {
    outline: none;
  }

  &::placeholder {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--button-text-graphite-primary-text);
  }

  ${p =>
    p.$focused &&
    css`
      padding: 4px 16px;
      box-shadow: inset 0 0 0 2px var(--primary-statuses-green-520);
    `}
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;

  width: 24px;
  height: 24px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 50%;

  transform: translateY(-50%);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-80);

    svg path {
      fill: var(--graphite-graphite-840);
    }
  }

  &:active {
    background-color: var(--graphite-graphite-120);
  }
`;

const Hint = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
  text-transform: uppercase;

  transform: translateY(-50%);
`;

interface Props {
  model: InputModel;
  loading?: boolean;
  placeholder?: string;
  onClear: () => void;
  onChange?: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
}

const SearchInput = observer((props: Props) => {
  const { model, placeholder, loading, onClear, onChange, onBlur, onFocus } = props;

  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState<string>(model.value);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setValue(value);
    model.setValue(value);

    onChange?.(value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);

    setIsFocused(false);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    onFocus?.(e);

    setIsFocused(true);
  };

  const handleClear = () => {
    model.value = '';
    setValue('');

    inputRef.current?.focus();

    onClear();
  };

  useWindowEvent('keydown', e => {
    if (e.code === 'KeyK' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();

      inputRef.current?.focus();
    }
  });

  useWindowEvent('keydown', e => {
    if (e.key === 'Escape' && isFocused) handleClear();
  });

  return (
    <Root>
      {!isFocused && (
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
      )}

      <StyledInput
        ref={inputRef}
        value={value}
        $focused={isFocused}
        placeholder={placeholder ?? t('search')}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
      />

      {loading && <Loader variant="outlined" offset={12} />}

      {!loading &&
        (model.trimmedValue.length > 0 ? (
          <ClearButton onClick={handleClear}>
            <ClearIcon />
          </ClearButton>
        ) : (
          // eslint-disable-next-line i18next/no-literal-string
          isFocused && <Hint>ctrl + k</Hint>
        ))}
    </Root>
  );
});

SearchInput.displayName = 'SearchInput';
export { SearchInput };
