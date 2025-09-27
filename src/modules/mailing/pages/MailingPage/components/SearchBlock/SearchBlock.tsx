import { ClearCrossIcon, debounce, InputModel, MyInput, SearchIcon, type Nullable } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CreateMessageButton } from '../CreateMessageButton/CreateMessageButton';

const Root = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 8px;
`;

const InputWrapper = styled.div`
  position: relative;

  width: 100%;

  input {
    padding: 0 20px 3px 20px;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;

  width: 16px;
  height: 18px;
`;

const ClearIconWrapper = styled.button`
  position: absolute;
  top: 3px;
  right: 0;

  width: 16px;
  height: 16px;

  svg path {
    fill: var(--button-text-graphite-primary-text);
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

export interface SearchBlockProps {
  loadThreads: () => void;
  clearThreads: () => void;
  handleClearSearch: () => void;
  setSearch: (search: Nullable<string>) => void;
}

const SearchBlock = observer((props: SearchBlockProps) => {
  const { loadThreads, clearThreads, handleClearSearch, setSearch } = props;

  const { t } = useTranslation();

  const searchModel = useLocalObservable<InputModel>(() => InputModel.create());

  const handleSearch = useCallback(
    (search: string) => {
      if (search.trim().length < 2) return;

      clearThreads();
      setSearch(search);

      loadThreads();
    },
    [clearThreads, loadThreads, setSearch]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 750), [handleSearch]);

  const onClearSearch = useCallback(() => {
    searchModel.value = '';

    handleClearSearch();
  }, [searchModel, handleClearSearch]);

  return (
    <Root>
      <InputWrapper>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>

        <MyInput
          model={searchModel}
          hasBorderBottom
          placeholder={t('search')}
          handleChange={debouncedHandleSearch}
        />

        {searchModel.value !== '' && (
          <ClearIconWrapper onClick={onClearSearch} title={t('clear_search')}>
            <ClearCrossIcon />
          </ClearIconWrapper>
        )}
      </InputWrapper>

      <CreateMessageButton />
    </Root>
  );
});

SearchBlock.displayName = 'SearchBlock';
export { SearchBlock };
