import type { FloatingPosition } from '@mantine/core';
import { Menu } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import type { CSSProperties, MouseEvent, ReactNode, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { MySelectTitleRootVariant } from '../../../../models';
import { ClearRoundButton } from '../../../Buttons/ClearRoundButton/ClearRoundButton';
import { MySelectTitle } from '../components';

const TitleWrapper = styled.div<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  transition: var(--transition-200);

  ${p => p.$disabled && `pointer-events: none`};
`;

interface StyledDropdownProps {
  $width?: number;
  $minWidth?: CSSProperties['minWidth'];
  $padding?: CSSProperties['padding'];
}

const StyledDropdown = styled(Menu.Dropdown)<StyledDropdownProps>`
  width: ${p => p.$width}px !important;
  min-width: ${p => p.$minWidth} !important;

  padding: ${p => p.$padding ?? '6px 0'};
  box-shadow: var(--dropdown-box-shadow);
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  border: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  ref?: Ref<HTMLDivElement>;
  opened: boolean;
  children: ReactNode;
  placeholder?: string;
  label?: string;
  width?: CSSProperties['width'];
  activeBgColor?: boolean;
  position?: FloatingPosition;
  titleWidth?: CSSProperties['width'];
  titleMaxWidth?: CSSProperties['maxWidth'];
  titleMinWidth?: CSSProperties['minWidth'];
  withinPortal?: boolean;
  closeOnClickOutside?: boolean;
  variant?: MySelectTitleRootVariant;
  dropdownWidth?: number;
  customButton?: ReactNode;
  dropdownMinWidth?: CSSProperties['minWidth'];
  disabled?: boolean;
  invalid?: boolean;
  titleBgColor?: string;
  dropdownPadding?: CSSProperties['padding'];
  onClear?: () => void;
  show: () => void;
  hide: () => void;
}

const MySelectCustomTemplate = observer((props: Props) => {
  const { t } = useTranslation();

  const {
    ref,
    label,
    placeholder = t('select'),
    children,
    activeBgColor,
    position = 'bottom-start',
    width,
    titleWidth,
    titleMaxWidth,
    titleMinWidth,
    withinPortal,
    closeOnClickOutside = true,
    opened,
    variant = 'filled',
    customButton,
    dropdownWidth,
    dropdownMinWidth,
    disabled = false,
    invalid = false,
    titleBgColor,
    dropdownPadding,
    onClear,
    show,
    hide,
  } = props;

  const currentLabel = label || placeholder;

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClear?.();
  };

  return (
    <Menu
      width={width}
      opened={opened}
      position={position}
      withinPortal={withinPortal}
      zIndex="var(--dropdown-z-index)"
      closeOnClickOutside={closeOnClickOutside}
      onOpen={show}
      onClose={hide}
    >
      <Menu.Target>
        {customButton ?? (
          <TitleWrapper $disabled={disabled} title={disabled ? t('field_readonly') : undefined}>
            <MySelectTitle
              ref={ref}
              active={opened}
              invalid={invalid}
              variant={variant}
              width={titleWidth}
              bgColor={titleBgColor}
              greenBg={activeBgColor}
              maxWidth={titleMaxWidth}
              minWidth={titleMinWidth}
              showPlaceholder={placeholder === currentLabel}
            >
              {currentLabel}
            </MySelectTitle>

            {onClear && <ClearRoundButton onClick={handleClear} />}
          </TitleWrapper>
        )}
      </Menu.Target>

      <StyledDropdown
        $width={dropdownWidth}
        $padding={dropdownPadding}
        $minWidth={dropdownMinWidth}
        className="workspace__MyDropdown--StyledDropdown"
      >
        {children}
      </StyledDropdown>
    </Menu>
  );
});

MySelectCustomTemplate.displayName = 'MySelectCustomTemplate';
export { MySelectCustomTemplate };
