import {
  MySelectCustomTemplate,
  SelectOptionItem,
  SelectOptionItemRoot,
  SelectOptionsList,
  useDropdownWidth,
  type MySelectTitleRootVariant,
  type Nullable,
  type Option,
  type Optional,
} from '@/shared';
import type { FloatingPosition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetDHMDateStringFromSeconds } from '../../hooks';
import { CustomIntervalInputGroup } from './components';

interface Props {
  delay: Nullable<number>;
  options: Option<Nullable<number>, Optional<{ minifiedLabel?: string }>>[];
  placeholder?: string;
  hideMinutes?: boolean;
  minifiedTitle?: boolean;
  dropdownFixedWidth?: number;
  position?: FloatingPosition;
  intervalInputFullWidth?: boolean;
  variant?: MySelectTitleRootVariant;
  titleWidth?: CSSProperties['width'];
  customIntervalColumnVariant?: boolean;
  maxHeight?: CSSProperties['maxHeight'];
  onChange: (delay: Nullable<number>) => void;
}

const DelaySelect = (props: Props) => {
  const { t } = useTranslation();

  const {
    delay,
    options,
    position,
    maxHeight,
    titleWidth,
    hideMinutes,
    minifiedTitle,
    dropdownFixedWidth,
    variant = 'outlined',
    intervalInputFullWidth,
    placeholder = t('delay'),
    customIntervalColumnVariant,
    onChange,
  } = props;

  const [opened, { close, open }] = useDisclosure(false);

  const [dropdownWidth, titleRef] = useDropdownWidth();

  const handleSelect = useCallback(
    (value: Nullable<number>) => {
      onChange(value);

      close();
    },
    [onChange, close]
  );

  const getSelectHandler = useCallback(
    (value: Nullable<number>) => () => handleSelect(value),
    [handleSelect]
  );

  const firstOptionLabel = options[0]?.label;

  const selectedOption = options.find(o => o.value === delay);

  if (!firstOptionLabel)
    throw new Error(
      `Failed to render DelaySelect, at least one option should be provided, options array is empty`
    );

  const formattedDelay = useGetDHMDateStringFromSeconds({
    value: delay ?? 0,
    minified: minifiedTitle,
  });

  const label = selectedOption
    ? minifiedTitle
      ? selectedOption.extra?.minifiedLabel
      : selectedOption.label
    : delay
      ? formattedDelay
      : placeholder;

  return (
    <MySelectCustomTemplate
      withinPortal
      label={label}
      ref={titleRef}
      opened={opened}
      variant={variant}
      dropdownPadding={0}
      position={position}
      titleWidth={titleWidth}
      placeholder={placeholder}
      dropdownWidth={dropdownFixedWidth ? dropdownFixedWidth : dropdownWidth}
      show={open}
      hide={close}
    >
      <SelectOptionsList maxHeight={maxHeight} padding="8px">
        {options.map(o => (
          <SelectOptionItem
            key={o.value}
            label={o.label}
            active={delay === o.value}
            onSelect={getSelectHandler(o.value)}
          />
        ))}

        <SelectOptionItemRoot $disableStates>
          <CustomIntervalInputGroup
            hideMinutes={hideMinutes}
            columnVariant={customIntervalColumnVariant}
            intervalInputFullWidth={intervalInputFullWidth}
            value={delay ? (selectedOption ? null : delay) : null}
            onChange={handleSelect}
          />
        </SelectOptionItemRoot>
      </SelectOptionsList>
    </MySelectCustomTemplate>
  );
};

export { DelaySelect };
