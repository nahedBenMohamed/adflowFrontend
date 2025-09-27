import { MiniLoader } from '@/shared';
import type { FloatingPosition } from '@mantine/core';
import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type CSSProperties, type ReactNode } from 'react';
import styled from 'styled-components';
import { useDropdownWidth } from '../../../hooks';
import type { MultiselectModel, MySelectTitleRootVariant, Option } from '../../../models';
import { MySelectTitle } from '../MySelect/components';
import { MultiselectOptionsList, type MultiselectOptionsListGroup } from './components';

interface StyledDropdownProps {
  $width: string;
  $maxWidth?: string;
  $minWidth?: string;
}

const StyledDropdown = styled(Menu.Dropdown)<StyledDropdownProps>`
  padding: 0;

  width: ${p => p.$width} !important;
  max-width: ${p => p.$maxWidth} !important;
  min-width: ${p => p.$minWidth} !important;

  z-index: var(--dropdown-z-index);

  overflow: hidden;
  box-shadow: var(--dropdown-box-shadow);
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);
`;

interface MenuShowHideProps {
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface ShowHideHandlers {
  opened: boolean;
  show: () => void;
  hide: () => void;
}

interface MultiselectWithCheckboxesProps<O extends Option> {
  options: O[];
  model: MultiselectModel<O['value']>;
  placeholder?: string;
  width?: string;
  maxHeight?: string;
  dropdownMaxWidth?: string;
  dropdownMinWidth?: string;
  withinPortal?: boolean;
  variant?: MySelectTitleRootVariant;
  CustomButton?: ReactNode;
  loading?: boolean;
  activeBgColor?: boolean;
  overrideShowHideHandlers?: ShowHideHandlers;
  position?: FloatingPosition;
  titleMinWidth?: CSSProperties['minWidth'];
  // for groups to work – if Option belongs to group, it should have groupId property in extra object
  groups?: MultiselectOptionsListGroup[];
  handleChange?: (value: O['value'][]) => void;
  handleGetTitle?: () => string;
}

// we compare values using JSON.stringify because in some cases option.value could be an object
const MultiselectWithCheckboxes = observer(
  <O extends Option>(props: MultiselectWithCheckboxesProps<O>) => {
    const {
      model,
      options,
      placeholder = '...',
      width,
      maxHeight = '304px',
      withinPortal,
      variant = 'outlined',
      dropdownMinWidth,
      dropdownMaxWidth,
      loading,
      CustomButton,
      activeBgColor = false,
      overrideShowHideHandlers,
      groups,
      position = 'bottom-start',
      titleMinWidth,
      handleChange,
    } = props;

    const [opened, { close: hide, open: show }] = useDisclosure(false);

    const menuShowHideProps: MenuShowHideProps = useMemo<MenuShowHideProps>(
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

    const [dropdownWidth, ref] = useDropdownWidth();

    const getTitle = useCallback((): ReactNode => {
      if (loading) return <MiniLoader color="var(--primary-statuses-green-520)" />;

      const currentOptionsLabels: string[] = [];

      model.values.forEach(v => {
        const option = options.find(o => JSON.stringify(o.value) === JSON.stringify(v));

        if (option) currentOptionsLabels.push(option.label);
      });

      return currentOptionsLabels.length > 0 ? currentOptionsLabels.join(', ') : placeholder;
    }, [model.values, loading, options, placeholder]);

    const handleSelect = useCallback(
      (value: O['value']) => {
        model.setValue([...model.values, value]);

        handleChange?.(model.values);
      },
      [model, handleChange]
    );

    const handleSelectGroup = useCallback(
      (values: O['value'][]) => {
        model.setValue(values);

        handleChange?.(model.values);
      },
      [model, handleChange]
    );

    const handleCancel = useCallback(
      (value: O['value']) => {
        model.setValue(model.values.filter(v => JSON.stringify(v) !== JSON.stringify(value)));

        handleChange?.(model.values);
      },
      [model, handleChange]
    );

    const title = getTitle();
    const showPlaceholder = title === placeholder;

    return (
      <Menu
        closeOnClickOutside
        position={position}
        withinPortal={withinPortal}
        zIndex="var(--dropdown-z-index)"
        {...menuShowHideProps}
      >
        <Menu.Target>
          {CustomButton ?? (
            <MySelectTitle
              ref={ref}
              width={width}
              variant={variant}
              greenBg={activeBgColor}
              invalid={!model.isValid}
              minWidth={titleMinWidth}
              active={menuShowHideProps.opened}
              showPlaceholder={showPlaceholder}
              menuShowHideProps={menuShowHideProps}
            >
              {title}
            </MySelectTitle>
          )}
        </Menu.Target>

        <StyledDropdown
          $maxWidth={dropdownMaxWidth}
          $minWidth={dropdownMinWidth}
          className="workspace__MyDropdown--StyledDropdown"
          $width={
            variant === 'filled' ||
            variant === 'outlined' ||
            variant === 'outlined-tall' ||
            variant === 'outlined-without-active-shadow'
              ? `${dropdownWidth}px`
              : width
                ? width
                : '100%'
          }
        >
          <MultiselectOptionsList
            groups={groups}
            variant={variant}
            options={options}
            maxHeight={maxHeight}
            currentValues={model.values}
            onSelect={handleSelect}
            onCancel={handleCancel}
            onSelectGroup={handleSelectGroup}
          />
        </StyledDropdown>
      </Menu>
    );
  }
);

MultiselectWithCheckboxes.displayName = 'MultiselectWithCheckboxes';
export { MultiselectWithCheckboxes };
