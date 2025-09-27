import type { FloatingPosition } from '@mantine/core';
import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { MiniLoader, MyTooltip } from '../../../../components';
import { followElement } from '../../../../helpers';
import { useAutoFocusOnMount, useDropdownWidth } from '../../../../hooks';
import {
  InputModel,
  type MySelectTitleRootVariant,
  type Option,
  type SelectModel,
} from '../../../../models';
import type { Nullable } from '../../../../types';
import {
  SELECT_OPTION_ITEM_DATA_ACTIVE,
  SelectOptionItem,
  SelectOptionsList,
} from '../../components';
import {
  MySelectSearchBlock,
  MySelectStyledDropdown,
  MySelectTitle,
  NoOptionsMessage,
} from '../components';

export interface MenuShowHideProps {
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface ShowHideHandlers {
  opened: boolean;
  show: () => void;
  hide: () => void;
}

export interface MySelectProps<O extends Option> {
  model: SelectModel;
  options: O[];
  zIndex?: number;
  margin?: string;
  width?: string;
  disabled?: boolean;
  titleGap?: string;
  placeholder?: string;
  label?: string;
  labelPostfix?: string;
  withinPortal?: boolean;
  activeBgColor?: boolean;
  CustomButton?: ReactNode;
  dropdownMinWidth?: string;
  dropdownMaxWidth?: string;
  noOptionsLabel?: ReactNode;
  hiddenlyDisabled?: boolean;
  searchBar?: Nullable<boolean>;
  variant?: MySelectTitleRootVariant;
  maxWidth?: CSSProperties['maxWidth'];
  overrideShowHideHandlers?: ShowHideHandlers;
  hideArrowWhenDisabled?: boolean;
  CustomBottomControls?: ReactNode;
  titleMinWidth?: CSSProperties['minWidth'];
  optionsLoading?: boolean;
  position?: FloatingPosition;
  // handle clear can be boolean in case we want to clear the model value by initializing it with null,
  // or it can be a function in case we want to do something else when clearing the value
  handleClear?: (() => void) | boolean;
  handleChange?: (value: O['value']) => void;
  handleChangeOption?: (option: O) => void;
}

const MySelect = observer(<O extends Option>(props: MySelectProps<O>) => {
  const {
    model,
    zIndex,
    options,
    margin = '0',
    width,
    disabled = false,
    titleGap,
    label,
    placeholder,
    withinPortal = false,
    CustomButton,
    labelPostfix = '',
    dropdownMinWidth,
    activeBgColor = false,
    dropdownMaxWidth,
    noOptionsLabel,
    hiddenlyDisabled,
    searchBar = null,
    variant = 'filled',
    maxWidth,
    CustomBottomControls,
    overrideShowHideHandlers,
    hideArrowWhenDisabled,
    titleMinWidth,
    optionsLoading,
    handleClear,
    position = 'bottom-start',
    handleChange,
    handleChangeOption,
  } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'form.my_select',
  });

  const [containerRef, setContainerRef] = useState<Nullable<HTMLUListElement>>(null);

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const searchInputRef = useAutoFocusOnMount(opened);

  const menuShowHideProps = useMemo<MenuShowHideProps>(
    () =>
      overrideShowHideHandlers
        ? {
            opened: overrideShowHideHandlers.opened,
            onOpen: overrideShowHideHandlers.show,
            onClose: overrideShowHideHandlers.hide,
          }
        : {
            opened,
            onOpen: show,
            onClose: hide,
          },
    [opened, overrideShowHideHandlers, show, hide]
  );

  const placeholderLabel = placeholder || t('placeholder');

  const [dropdownWidth, ref] = useDropdownWidth();

  const searchModel = useLocalObservable<InputModel>(() => InputModel.create());
  const [filteredOptions, setFilteredOptions] = useState<O[]>(options);

  const [current, setCurrent] = useState(0);

  const getChangeHandler = useCallback(
    (option: O) => () => {
      model.setValue(option.value);

      handleChange?.(option.value);
      handleChangeOption?.(option);

      const currentIdx = options.findIndex(o => o.value === option.value);

      if (currentIdx === -1)
        throw new Error(
          `Failed to get currentIdx in MySelect onChange method with ${option.value}`
        );

      setCurrent(currentIdx);

      menuShowHideProps.onClose();
    },
    [menuShowHideProps, model, options, handleChangeOption, handleChange]
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    e => {
      switch (e.key) {
        case 'ArrowUp':
          setCurrent(prev => (prev > 0 ? --prev : prev));

          followElement({ element: containerRef, selector: SELECT_OPTION_ITEM_DATA_ACTIVE });

          break;

        case 'ArrowDown':
          setCurrent(prev => (prev < filteredOptions.length - 1 ? ++prev : prev));

          followElement({ element: containerRef, selector: SELECT_OPTION_ITEM_DATA_ACTIVE });

          break;

        case 'Enter':
          const option = filteredOptions[current];

          if (option) getChangeHandler(option)();

          break;

        default:
          return;
      }
    },
    [current, containerRef, filteredOptions, getChangeHandler]
  );

  const [currentLabel, setCurrentLabel] = useState<string>(
    // in case value is an object or class exemplar
    options.find(o => JSON.stringify(o.value) === JSON.stringify(model.value))?.label ||
      placeholderLabel
  );

  useEffect(() => {
    const currentOption = options.find(
      o => JSON.stringify(o.value) === JSON.stringify(model.value)
    );

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setCurrentLabel(currentOption?.label || placeholderLabel);
  }, [model.value, options, placeholderLabel]);

  let isSearchBarShown: boolean;

  if (searchBar === null) {
    isSearchBarShown = options.length >= 10;
  } else {
    isSearchBarShown = searchBar;
  }

  const handleClearSearch = useCallback<MouseEventHandler<HTMLButtonElement>>(
    e => {
      e.stopPropagation();

      searchModel.value = '';
      searchInputRef.current?.focus();
    },
    [searchModel, searchInputRef]
  );

  useEffect(() => {
    const filteredOptions = options.filter(o =>
      o.label.toLowerCase().includes(searchModel.value.toLowerCase())
    );

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setFilteredOptions(filteredOptions);
  }, [searchModel.value, options]);

  useEffect(() => {
    if (!menuShowHideProps.opened) {
      searchModel.value = '';

      return;
    }
  }, [menuShowHideProps.opened, searchModel]);

  const showPlaceholder = currentLabel === placeholderLabel;

  const onClear = useCallback(() => {
    model.value = null;

    handleChange?.(null);
  }, [model, handleChange]);

  useEffect(() => {
    const currentIdx = filteredOptions.findIndex(o => o.value === model.value);

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setCurrent(currentIdx);

    if (opened) followElement({ element: containerRef, selector: SELECT_OPTION_ITEM_DATA_ACTIVE });
  }, [opened, containerRef, filteredOptions, model.value]);

  return (
    <Menu
      position={position}
      closeOnClickOutside
      {...menuShowHideProps}
      withinPortal={withinPortal}
      zIndex={zIndex ?? 'var(--dropdown-z-index)'}
    >
      <MyTooltip withinPortal label={label} disabled={!Boolean(label)}>
        <Menu.Target>
          {CustomButton ?? (
            <MySelectTitle
              ref={ref}
              width={width}
              gap={titleGap}
              margin={margin}
              variant={variant}
              disabled={disabled}
              maxWidth={maxWidth}
              greenBg={activeBgColor}
              invalid={!model.isValid}
              minWidth={titleMinWidth}
              showPlaceholder={showPlaceholder}
              active={menuShowHideProps.opened}
              hiddenlyDisabled={hiddenlyDisabled}
              menuShowHideProps={menuShowHideProps}
              hideArrowWhenDisabled={hideArrowWhenDisabled}
              onClear={typeof handleClear === 'boolean' ? onClear : handleClear}
            >
              {`${currentLabel}${labelPostfix}`}
            </MySelectTitle>
          )}
        </Menu.Target>
      </MyTooltip>

      {!disabled && (
        <MySelectStyledDropdown
          $width={dropdownWidth}
          $maxWidth={dropdownMaxWidth}
          $minWidth={dropdownMinWidth ?? 'var(--field-dropdown-min-width)'}
          className="workspace__MyDropdown--StyledDropdown"
          onKeyDown={handleKeyDown}
        >
          {isSearchBarShown && (
            <MySelectSearchBlock
              ref={searchInputRef}
              model={searchModel}
              handleClear={handleClearSearch}
            />
          )}

          {filteredOptions.length > 0 ? (
            <SelectOptionsList ref={setContainerRef} padding="8px">
              {filteredOptions.map((o, idx) => (
                <SelectOptionItem
                  key={JSON.stringify(o.value)}
                  label={o.label}
                  focused={idx === current}
                  filter={searchModel.value}
                  // in case value is an object or class exemplar
                  active={JSON.stringify(model.value) === JSON.stringify(o.value)}
                  onSelect={getChangeHandler(o)}
                />
              ))}
            </SelectOptionsList>
          ) : (
            (noOptionsLabel ?? (
              <NoOptionsMessage>
                {optionsLoading ? (
                  <MiniLoader color="var(--primary-statuses-green-520)" />
                ) : (
                  t('no_options')
                )}
              </NoOptionsMessage>
            ))
          )}

          {CustomBottomControls}
        </MySelectStyledDropdown>
      )}
    </Menu>
  );
});

MySelect.displayName = 'MySelect';
export { MySelect };
