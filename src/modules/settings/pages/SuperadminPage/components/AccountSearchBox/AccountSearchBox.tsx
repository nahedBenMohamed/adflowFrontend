import { appStore, generalSettingsApi } from '@/app';
import { SEARCH_ITEM_DATA_ACTIVE } from '@/modules/section/shared/lib/components/SearchBlock/components/SearchBox/components';
import { Account } from '@/modules/settings';
import { AccountSearchList } from '@/modules/settings/pages/SuperadminPage/components/AccountSearchBox/AccountSearchList';
import {
  InputModel,
  MyPopover,
  NotFoundIcon,
  SearchInput,
  debounce,
  followElement,
  useDropdownWidth,
  type Nullable,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState, type KeyboardEventHandler } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
  max-width: 640px;
`;

const InputWrapper = styled.div`
  width: 100%;
`;

const NotFoundBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 24px 0 16px;
`;

interface Props {
  onSelect: (account: Account) => void;
}

const AccountSearchBox = observer((props: Props) => {
  const { onSelect } = props;

  const searchModel = useLocalObservable(() => InputModel.create());

  const [isDropdownOpened, { close, open }] = useDisclosure(false);

  const [accountSearchModels, setAccountSearchModels] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [containerRef, setContainerRef] = useState<Nullable<HTMLUListElement>>(null);
  const [currentIdx, setCurrentIdx] = useState(-1);

  const handleSelect = useCallback(
    (account: Account) => {
      onSelect(account);

      close();
    },
    [close, onSelect]
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    e => {
      switch (e.key) {
        case 'ArrowUp':
          setCurrentIdx(prev => (prev > 0 ? prev - 1 : prev));

          followElement({ element: containerRef, selector: SEARCH_ITEM_DATA_ACTIVE });

          break;

        case 'ArrowDown':
          setCurrentIdx(prev => (prev < accountSearchModels.length - 1 ? prev + 1 : prev));

          followElement({ element: containerRef, selector: SEARCH_ITEM_DATA_ACTIVE });

          break;

        case 'Enter':
          const option = accountSearchModels[currentIdx];

          if (option) handleSelect(option);

          break;

        default:
          return;
      }
    },
    [accountSearchModels, containerRef, currentIdx, handleSelect]
  );

  const searchAccountsBySubdomain = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      const accounts = await generalSettingsApi.searchAccounts(searchModel.trimmedValue);

      setAccountSearchModels(accounts);

      open();

      if (accounts.length !== 0) {
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (e) {
      console.error('Error while searching accounts by name', e);
    } finally {
      setIsLoading(false);
    }
  }, [searchModel.trimmedValue, open]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchAccountsBySubdomain = useCallback(
    debounce(searchAccountsBySubdomain, 750),
    []
  );

  const handleChange = useCallback(
    (value: string) => {
      close();
      setAccountSearchModels([]);

      if (value.trim().length > 2) {
        debouncedSearchAccountsBySubdomain();
      } else {
        close();
      }
    },
    [close, debouncedSearchAccountsBySubdomain]
  );

  const handleClear = useCallback(() => {
    setAccountSearchModels([]);

    close();
  }, [close]);

  const handleFocus = useCallback(() => {
    if (searchModel.trimmedValue.length > 2 && accountSearchModels.length > 0) open();
  }, [searchModel.trimmedValue.length, accountSearchModels.length, open]);

  const [dropdownWidth, ref] = useDropdownWidth();

  const popoverWidth = useMemo<number>(() => {
    const MAX_WIDTH = 500;

    const calculatedWidth = dropdownWidth * 2;

    return calculatedWidth < MAX_WIDTH ? calculatedWidth : MAX_WIDTH;
  }, [dropdownWidth]);

  if (!appStore.isLoaded) return null;

  return (
    <Root onKeyDown={handleKeyDown}>
      <MyPopover
        withinPortal
        position="bottom"
        width={popoverWidth}
        opened={isDropdownOpened}
        Target={
          <InputWrapper ref={ref}>
            <SearchInput
              model={searchModel}
              loading={isLoading}
              onClear={handleClear}
              onFocus={handleFocus}
              onChange={handleChange}
            />
          </InputWrapper>
        }
        hide={close}
      >
        {notFound ? (
          <NotFoundBlock>
            {'Аккаунты не найдены'}

            <NotFoundIcon />
          </NotFoundBlock>
        ) : (
          <AccountSearchList
            ref={setContainerRef}
            current={currentIdx}
            filter={searchModel.value}
            accounts={accountSearchModels}
            onSelect={handleSelect}
          />
        )}
      </MyPopover>
    </Root>
  );
});

AccountSearchBox.displayName = 'AccountSearchBox';
export { AccountSearchBox };
