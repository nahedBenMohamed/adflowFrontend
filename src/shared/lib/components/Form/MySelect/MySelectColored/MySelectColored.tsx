import { MiniLoader, type Nullable, type Optional } from '@/shared';
import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useDropdownWidth } from '../../../../hooks';
import { type MySelectTitleRootVariant, type Option, type SelectModel } from '../../../../models';
import { SelectOptionItem, SelectOptionsList } from '../../components';
import { MySelectTitle, NoOptionsMessage } from '../components';

interface MySelectColoredStyledDropdownProps {
  $width: number;
  $maxWidth?: string;
  $minWidth?: string;
}

const MySelectColoredStyledDropdown = styled(Menu.Dropdown)<MySelectColoredStyledDropdownProps>`
  padding: 0;

  width: ${p => p.$width}px !important;
  max-width: ${p => p.$maxWidth};
  min-width: ${p => p.$minWidth};

  z-index: var(--dropdown-z-index);

  overflow: hidden;
  box-shadow: var(--dropdown-box-shadow);
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);
`;

interface MySelectProps<O extends ColoredSelectOption> {
  model: SelectModel;
  options: O[];
  selectedOption?: O;
  placeholder?: string;
  withinPortal?: boolean;
  dropdownMaxWidth?: string;
  dropdownMinWidth?: string;
  loading?: boolean;
  disabled?: boolean;
  width?: number;
  margin?: string;
  // handle clear can be boolean in case we want to clear the model value by initializing it with null,
  // or it can be a function in case we want to do something else when clearing the value
  handleClear?: (() => void) | boolean;
  variant?: MySelectTitleRootVariant;
  handleChange?: (value: O['value']) => void;
}

type ColoredSelectOption = Option<Nullable<string | number>, Optional<{ bgColor?: string }>>;

const MySelectColored = observer(<O extends ColoredSelectOption>(props: MySelectProps<O>) => {
  const {
    model,
    options,
    selectedOption,
    placeholder,
    withinPortal = false,
    dropdownMaxWidth,
    dropdownMinWidth,
    loading,
    width,
    disabled,
    margin,
    handleClear,
    variant = 'outlined',
    handleChange,
  } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'form.my_select',
  });

  const placeholderLabel = placeholder ?? t('placeholder');

  const [dropdownWidth, ref] = useDropdownWidth();

  const [opened, { toggle: toggleOpened, close: hide, open: show }] = useDisclosure(false);

  const currentOption = selectedOption ?? options.find(o => o.value === model.value);

  const currentLabel = loading ? (
    <MiniLoader color="var(--primary-statuses-green-520)" />
  ) : currentOption ? (
    currentOption.label
  ) : (
    placeholderLabel
  );
  const currentColor = currentOption ? currentOption.extra?.bgColor : undefined;

  const showPlaceholder = currentLabel === placeholderLabel;

  const getChangeHandler = useCallback(
    (option: O) => () => {
      model.setValue(option.value);

      handleChange?.(option.value);

      hide();
    },
    [model, hide, handleChange]
  );

  const onClear = useCallback(() => {
    model.value = null;

    handleChange?.(null);
  }, [model, handleChange]);

  return (
    <Menu
      opened={opened}
      disabled={disabled}
      closeOnClickOutside
      position="bottom-start"
      withinPortal={withinPortal}
      zIndex="var(--dropdown-z-index)"
      onOpen={loading ? undefined : show}
      onClose={hide}
    >
      <Menu.Target>
        <MySelectTitle
          ref={ref}
          width={width}
          active={opened}
          margin={margin}
          variant={variant}
          disabled={disabled}
          bgColor={currentColor}
          invalid={!model.isValid}
          showPlaceholder={showPlaceholder}
          onClear={typeof handleClear === 'boolean' ? onClear : handleClear}
          onClick={toggleOpened}
        >
          {currentLabel}
        </MySelectTitle>
      </Menu.Target>

      <MySelectColoredStyledDropdown
        $maxWidth={dropdownMaxWidth}
        $minWidth={dropdownMinWidth}
        $width={width ? width : dropdownWidth}
        className="workspace__MyDropdown--StyledDropdown"
      >
        {options.length > 0 ? (
          <SelectOptionsList transparentScrollbarTrack>
            {options.map(o => (
              <SelectOptionItem
                key={o.value}
                label={o.label}
                bgColor={o.extra?.bgColor}
                active={o.value === model.value}
                onSelect={getChangeHandler(o)}
              />
            ))}
          </SelectOptionsList>
        ) : (
          <NoOptionsMessage>{t('no_options')}</NoOptionsMessage>
        )}
      </MySelectColoredStyledDropdown>
    </Menu>
  );
});

MySelectColored.displayName = 'MySelectColored';
export { MySelectColored };
