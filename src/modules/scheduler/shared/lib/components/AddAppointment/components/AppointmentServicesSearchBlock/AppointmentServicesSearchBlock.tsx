import { productApi, type Product } from '@/modules/products';
import {
  ClearCrossIcon,
  InputModel,
  MyDropdownList,
  MyInput,
  MyPopover,
  NoOptionsMessage,
  SearchLegacy,
  debounce,
  useDropdownWidth,
  type Option,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import type { AppointmentOrderStore } from '../../../../../../store';

const InputWrapper = styled.div`
  position: relative;

  width: 320px;

  input {
    padding-left: 24px;
    padding-right: 24px;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  top: 7px;
  left: 6px;

  width: 11px;
  height: 12px;

  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ClearIconWrapper = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

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

interface Props {
  orderStore: AppointmentOrderStore;
}

const AppointmentServicesSearchBlock = observer((props: Props) => {
  const {
    orderStore: { orderItemRows, sectionId, addOrderItemRow },
  } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const search = useLocalObservable(() => InputModel.create());

  const [services, setServices] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [isDropdownOpened, { close, open }] = useDisclosure(false);

  const [dropdownWidth, ref] = useDropdownWidth();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchServices = useCallback(
    debounce(async (): Promise<void> => {
      try {
        setIsLoading(true);

        const { products } = await productApi.getProducts({
          sectionId,
          queryParams: {
            search: search.trimmedValue,
          },
        });

        // filter products that are not services and that are already added to order
        const services = products
          .filter(p => p.isService())
          .filter(p => !orderItemRows.find(r => r.service.id === p.id));

        setServices(services);
        open();

        if (services.length !== 0) {
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (e) {
        throw new Error(`Error while searching services by name ${search.value}: ${e}`);
      } finally {
        setIsLoading(false);
      }
    }, 350),
    [sectionId, orderItemRows]
  );

  const handleClearServices = useCallback(() => {
    close();

    setServices([]);
  }, [close]);

  const handleChange = useCallback(
    (value: string) => {
      const trimmedValue = value.trim();

      if (trimmedValue.length > 2) {
        debouncedSearchServices();
      } else {
        handleClearServices();
      }
    },
    [debouncedSearchServices, handleClearServices]
  );

  const trimmedSearch = useMemo(() => search.trimmedValue, [search.trimmedValue]);

  const handleClear = useCallback(() => {
    search.value = '';

    flushSync(() => {
      handleClearServices();
    });

    inputRef.current?.focus();
  }, [search, handleClearServices]);

  const handleSelect = useCallback(
    (option: Option<number, { service: Product }>) => {
      if (!option.extra?.service)
        throw new Error(
          `Failed to select service, no service defined in option's extra field ${JSON.stringify(option.extra)}`
        );

      addOrderItemRow(option.extra?.service);

      handleClear();
    },
    [addOrderItemRow, handleClear]
  );

  const servicesOptions = useMemo<Option<number, { service: Product }>[]>(
    () =>
      services.map(s => ({
        label: s.name,
        value: s.id,
        extra: {
          service: s,
        },
      })),
    [services]
  );

  useOnClickOutside(ref as RefObject<HTMLDivElement>, e => {
    const target = e.target as HTMLElement;

    if (
      target.closest('.workspace__MyDropdown--StyledDropdown') ||
      target.closest('.workspace__MyPopover--StyledDropdown')
    )
      return;

    close();
  });

  return (
    <MyPopover
      withinPortal
      position="bottom"
      width={dropdownWidth}
      opened={isDropdownOpened}
      Target={
        <InputWrapper ref={ref}>
          <SearchIconWrapper>
            <SearchLegacy />
          </SearchIconWrapper>

          <MyInput
            ref={inputRef}
            autoFocus
            model={search}
            hasBorderBottom
            variant="outlined"
            loading={isLoading}
            hasBorderBottomLight
            placeholder={t('placeholders.search_services')}
            handleChange={handleChange}
            onFocus={services.length > 0 ? open : undefined}
          />

          {!isLoading && trimmedSearch.length > 0 && (
            <ClearIconWrapper onClick={handleClear}>
              <ClearCrossIcon />
            </ClearIconWrapper>
          )}
        </InputWrapper>
      }
      hide={close}
    >
      {notFound ? (
        <NoOptionsMessage>{t('no_services')}</NoOptionsMessage>
      ) : (
        <MyDropdownList
          maxHeight="360px"
          highlight={trimmedSearch}
          options={servicesOptions}
          onSelect={handleSelect}
        />
      )}
    </MyPopover>
  );
});

AppointmentServicesSearchBlock.displayName = 'AppointmentServicesSearchBlock';
export { AppointmentServicesSearchBlock };
