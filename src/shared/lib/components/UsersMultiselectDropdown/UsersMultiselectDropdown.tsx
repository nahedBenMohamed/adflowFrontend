import { Menu } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type CSSProperties, type ReactNode } from 'react';
import styled from 'styled-components';
import { useDropdownWidth } from '../../hooks';
import type { MultiselectModel, Option, User } from '../../models';
import { MySelectStyledDropdown } from '../Form/MySelect/components';
import {
  UserList,
  type UserDropdownItemMeta,
  type UserListMultiselectProps,
} from '../Form/UserPicker/components';

const TargetWrapper = styled.div<{
  $width?: CSSProperties['width'];
}>`
  width: ${p => p.$width ?? '100%'};
`;

interface Props {
  users: User[];
  opened: boolean;
  children: ReactNode;
  model: MultiselectModel<number>;
  width?: number;
  disabled?: boolean;
  withinPortal?: boolean;
  dropdownMinWidth?: string;
  titleWidth?: CSSProperties['width'];
  usersMeta?: UserDropdownItemMeta[];
  emptyUserOptionTitle?: string;
  ignoreAccessibleUsers?: boolean;
  hide: () => void;
  show: () => void;
  handleChange?: (selectedIds: number[]) => void;
}

const UsersMultiselectDropdown = observer((props: Props) => {
  const {
    children,
    users,
    model,
    opened,
    width,
    disabled = false,
    withinPortal = false,
    dropdownMinWidth,
    titleWidth,
    usersMeta,
    emptyUserOptionTitle,
    ignoreAccessibleUsers,
    hide,
    show,
    handleChange,
  } = props;

  const [dropdownWidth, ref] = useDropdownWidth();

  const handleSelect = useCallback(
    (option: Option<number>) => {
      if (model.values.includes(option.value) && option.value !== -1) {
        model.setValue(model.values.filter(v => v !== option.value));

        if (model.values.length === 0 && emptyUserOptionTitle) model.setValue([-1]);
      } else {
        model.setValue(model.values.filter(v => v > 0));

        model.setValue([...model.values, option.value]);
      }

      handleChange?.(model.values);
    },
    [model, emptyUserOptionTitle, handleChange]
  );

  const handleGroupSelect = useCallback(
    (options: Option<number>[]) => {
      const addedValues = options.filter(o => !model.values.includes(o.value)).map(o => o.value);

      if (addedValues.length) {
        model.setValue([...model.values, ...addedValues]);
      } else {
        model.setValue(model.values.filter(v => !options.some(o => o.value === v)));
      }

      handleChange?.(model.values);
    },
    [model, handleChange]
  );

  const multiselectProps = useMemo<UserListMultiselectProps>(
    () => ({
      selectedUserIds: model.values,
      onSelect: handleSelect,
      onGroupSelect: handleGroupSelect,
    }),
    [model.values, handleSelect, handleGroupSelect]
  );

  return (
    <Menu
      opened={opened}
      closeOnClickOutside
      position="bottom-start"
      withinPortal={withinPortal}
      zIndex="var(--dropdown-z-index)"
      onClose={hide}
      onOpen={disabled ? undefined : show}
    >
      <Menu.Target>
        <TargetWrapper ref={ref} $width={titleWidth}>
          {children}
        </TargetWrapper>
      </Menu.Target>

      <MySelectStyledDropdown
        $minWidth={dropdownMinWidth}
        $width={width ? width : dropdownWidth}
        className="workspace__MyDropdown--StyledDropdown"
      >
        <UserList
          users={users}
          usersMeta={usersMeta}
          multiselectProps={multiselectProps}
          emptyUserOptionTitle={emptyUserOptionTitle}
          ignoreAccessibleUsers={ignoreAccessibleUsers}
        />
      </MySelectStyledDropdown>
    </Menu>
  );
});

UsersMultiselectDropdown.displayName = 'UsersMultiselectDropdown';
export { UsersMultiselectDropdown };
