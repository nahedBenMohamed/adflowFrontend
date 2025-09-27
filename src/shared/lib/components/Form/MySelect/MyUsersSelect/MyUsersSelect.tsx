import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type CSSProperties, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropdownWidth } from '../../../../hooks';
import type {
  MySelectOptionValueType,
  MySelectTitleRootVariant,
  Option,
  SelectModel,
  User,
} from '../../../../models';
import type { Nullable, Optional, ShowHideHandlers } from '../../../../types';
import type { MenuShowHideProps } from '../../MySelect/components';
import { UserList, type UserListSelectProps } from '../../UserPicker/components';
import { MySelectCustomTemplate } from '../MySelectCustomTemplate/MySelectCustomTemplate';

interface Props {
  model: SelectModel;
  users: User[];
  disabled?: boolean;
  placeholder?: string;
  withinPortal?: boolean;
  customButton?: ReactNode;
  fixedDropdownWidth?: number;
  width?: CSSProperties['width'];
  variant?: MySelectTitleRootVariant;
  maxWidth?: CSSProperties['maxWidth'];
  overrideShowHideHandlers?: ShowHideHandlers;
  // title for the option, which will represent null value
  emptyUserOptionTitle?: string;
  handleClear?: () => void;
  handleChange?: (value: MySelectOptionValueType) => void;
}

const MyUsersSelect = observer((props: Props) => {
  const {
    model,
    users,
    width,
    variant,
    disabled,
    maxWidth,
    placeholder,
    withinPortal,
    customButton,
    fixedDropdownWidth,
    emptyUserOptionTitle,
    overrideShowHideHandlers,
    handleChange,
    handleClear,
  } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'form.my_select',
  });

  const [opened, { close, open }] = useDisclosure(false);

  const [dropdownWidth, ref] = useDropdownWidth();

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
            onOpen: open,
            onClose: close,
          },
    [overrideShowHideHandlers, opened, open, close]
  );

  const handleSelect = useCallback(
    (option: Option<Nullable<number>>) => {
      model.setValue(option.value);

      handleChange?.(option.value);

      menuShowHideProps.onClose();
    },
    [model, handleChange, menuShowHideProps]
  );

  const selectProps = useMemo<UserListSelectProps>(
    () => ({
      onSelect: handleSelect,
      selectedUserId: model.value ?? null,
    }),
    [handleSelect, model.value]
  );

  const label = useMemo<Optional<string>>(
    () =>
      model.value === null && emptyUserOptionTitle
        ? emptyUserOptionTitle
        : users.find(u => u.id === model.value)?.fullName,
    [model.value, users, emptyUserOptionTitle]
  );

  return (
    <MySelectCustomTemplate
      ref={ref}
      label={label}
      variant={variant}
      titleWidth={width}
      disabled={disabled}
      titleMaxWidth={maxWidth}
      invalid={!model.isValid}
      withinPortal={withinPortal}
      customButton={customButton}
      opened={menuShowHideProps.opened}
      placeholder={placeholder || t('select_user')}
      width={fixedDropdownWidth ? fixedDropdownWidth : dropdownWidth}
      show={menuShowHideProps.onOpen}
      hide={menuShowHideProps.onClose}
      onClear={model.value ? handleClear : undefined}
    >
      <UserList
        padding={0}
        users={users}
        selectProps={selectProps}
        emptyUserOptionTitle={emptyUserOptionTitle}
      />
    </MySelectCustomTemplate>
  );
});

export { MyUsersSelect };
