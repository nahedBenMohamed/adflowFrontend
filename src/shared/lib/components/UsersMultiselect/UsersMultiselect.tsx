import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropdownWidth } from '../../hooks';
import type { MultiselectModel, MySelectTitleRootVariant, User } from '../../models';
import { MySelectTitle } from '../Form/MySelect/components';
import { UsersMultiselectDropdown } from '../UsersMultiselectDropdown/UsersMultiselectDropdown';

interface Props {
  users: User[];
  model: MultiselectModel<number>;
  withinPortal?: boolean;
  placeholder?: string;
  titleWidth?: string;
  fixedDropdownWidth?: number;
  variant?: MySelectTitleRootVariant;
  titleMinWidth?: CSSProperties['minWidth'];
  ignoreAccessibleUsers?: boolean;
  emptyUserOptionTitle?: string;
  handleChange?: (userIds: number[]) => void;
}

const UsersMultiselect = observer((props: Props) => {
  const { t } = useTranslation();

  const {
    model,
    users,
    withinPortal = false,
    placeholder = t('select'),
    titleWidth,
    fixedDropdownWidth,
    variant,
    titleMinWidth,
    emptyUserOptionTitle,
    ignoreAccessibleUsers,
    handleChange,
  } = props;

  const [opened, { toggle, close, open }] = useDisclosure(false);

  const [dropdownWidth, ref] = useDropdownWidth();

  const getTitle = (): string => {
    const currentUserNames: string[] = [];

    model.values.forEach(value => {
      const option = users.find(u => u.id === value);

      if (option) currentUserNames.push(option.fullName);
    });

    return currentUserNames.length > 0
      ? currentUserNames.join(', ')
      : (emptyUserOptionTitle ?? placeholder);
  };

  const title = getTitle();
  const showPlaceholder = title === placeholder;

  return (
    <UsersMultiselectDropdown
      model={model}
      users={users}
      opened={opened}
      titleWidth={titleWidth}
      dropdownMinWidth="256px"
      withinPortal={withinPortal}
      width={fixedDropdownWidth ?? dropdownWidth}
      emptyUserOptionTitle={emptyUserOptionTitle}
      ignoreAccessibleUsers={ignoreAccessibleUsers}
      hide={close}
      show={open}
      handleChange={handleChange}
    >
      <MySelectTitle
        ref={ref}
        active={opened}
        variant={variant}
        width={titleWidth}
        minWidth={titleMinWidth}
        invalid={!model.isValid}
        showPlaceholder={showPlaceholder}
        onClick={toggle}
      >
        {title}
      </MySelectTitle>
    </UsersMultiselectDropdown>
  );
});

UsersMultiselect.displayName = 'UsersMultiselect';
export { UsersMultiselect };
