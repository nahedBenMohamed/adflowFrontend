import { authStore } from '@/modules/auth';
import { departmentsSettingsStore } from '@/modules/settings';
import {
  DropdownScrollbarMixin,
  GroupIcon,
  InputModel,
  MySelectSearchBlock,
  NoOptionsMessage,
  SpanWithEllipsis,
  SubgroupIcon,
  useAutoFocusOnMount,
  type Nullable,
  type Option,
  type User,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  Fragment,
  useMemo,
  type CSSProperties,
  type ReactEventHandler,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type {
  Avatar,
  DepartmentWithUsersOption,
  SubdepartmentWithUsersOption,
} from '../../../../../models';
import { SelectAllBlock } from '../SelectAllBlock/SelectAllBlock';
import { UserDropdownItem, type UserDropdownItemMeta } from '../UserDropdownItem/UserDropdownItem';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

interface ListProps {
  $padding?: CSSProperties['padding'];
  $minWidth?: CSSProperties['minWidth'];
  $maxHeight: CSSProperties['maxHeight'];
}

const List = styled.div<ListProps>`
  position: relative;

  max-height: ${p => p.$maxHeight};
  min-width: ${p => p.$minWidth};

  display: flex;
  flex-direction: column;

  overflow-y: auto;
  overflow-x: hidden;

  ${DropdownScrollbarMixin};

  padding: ${p => p.$padding};
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;
`;

const DepartmentItem = styled.li<{ $hoverable: boolean }>`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  text-transform: uppercase;
  color: var(--button-text-graphite-priory-text);

  padding: 8px;

  &:hover {
    cursor: ${p => p.$hoverable && 'pointer'};
  }
`;

const Delimiter = styled.hr`
  width: 100%;

  border-top: 1px solid var(--graphite-graphite-80);
`;

const SubdepartmentItem = styled.div<{ $hoverable: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  text-transform: uppercase;
  color: var(--button-text-graphite-primary-text);

  padding: 8px;

  &:hover {
    cursor: ${p => p.$hoverable && 'pointer'};
  }
`;

type SelectHandler = (option: Option<Nullable<number>>) => void;
type MultiselectHandler = (option: Option<number>) => void;

export interface UserListSelectProps {
  selectedUserId: Nullable<number>;
  onSelect: SelectHandler;
}

export interface UserListMultiselectProps {
  selectedUserIds: number[];
  onSelect: MultiselectHandler;
  onGroupSelect?: (options: Option<number>[]) => void;
}

interface Props {
  users: User[];
  hoverable?: boolean;
  listTitle?: ReactNode;
  selectProps?: UserListSelectProps;
  padding?: CSSProperties['padding'];
  minWidth?: CSSProperties['minWidth'];
  maxHeight?: CSSProperties['maxHeight'];
  multiselectProps?: UserListMultiselectProps;
  usersMeta?: UserDropdownItemMeta[];
  // title for the option, which will represent null value
  emptyUserOptionTitle?: string;
  ignoreAccessibleUsers?: boolean;
  renderExtra?: (userId: number) => ReactNode;
}

const showThisSubdepartment = (subdepartment: SubdepartmentWithUsersOption): boolean =>
  subdepartment.options.length > 0;

const showThisDepartment = (department: DepartmentWithUsersOption): boolean =>
  department.department.options.length > 0 ||
  department.subdepartments.some(s => showThisSubdepartment(s));

const UserList = observer((props: Props) => {
  const {
    users,
    hoverable = true,
    listTitle,
    selectProps,
    padding,
    minWidth,
    maxHeight = '304px',
    multiselectProps,
    usersMeta,
    emptyUserOptionTitle,
    ignoreAccessibleUsers,
    renderExtra,
  } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'form.my_select',
  });

  const searchInputRef = useAutoFocusOnMount();

  const { user: currentUser } = authStore;
  const { departments } = departmentsSettingsStore;

  if (!currentUser) throw new Error('currentUser does not exist, failed to render UserList');

  // Empty array (currentUser.accessibleUserIds) means that all users are accessible
  const accessibleUsers = useMemo<User[]>(
    () =>
      ignoreAccessibleUsers
        ? users
        : currentUser && currentUser.accessibleUserIds.length > 0
          ? users.filter(
              // We should always show current user in the list even if he is not in accessible array
              u => currentUser.accessibleUserIds.includes(u.id) || u.id === currentUser.id
            )
          : users,
    [users, currentUser, ignoreAccessibleUsers]
  );

  const searchModel = useLocalObservable<InputModel>(() => InputModel.create());

  const handleClearSearch: ReactEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();

    searchModel.value = '';
    searchInputRef.current?.focus();
  };

  const usersWithoutDepartmentOptions = accessibleUsers
    .filter(u => !u.departmentId)
    .map<Option<number, { avatar: Avatar }>>(u => ({
      value: u.id,
      label: u.fullName,
      extra: {
        avatar: u.getAvatar(),
      },
    }));

  const usersWithDepartmentsOptions = departments.map<DepartmentWithUsersOption>(d => {
    const subs = d.subordinates.map<SubdepartmentWithUsersOption>(sub => ({
      id: sub.id,
      name: sub.name,
      options: accessibleUsers
        .filter(u => u.departmentId === sub.id)
        .map<Option<number, { avatar: Avatar }>>(u => ({
          value: u.id,
          label: u.fullName,
          extra: {
            avatar: u.getAvatar(),
          },
        })),
    }));

    return {
      department: {
        id: d.id,
        name: d.name,
        options: accessibleUsers
          .filter(u => u.departmentId === d.id)
          .map<Option<number, { avatar: Avatar }>>(u => ({
            value: u.id,
            label: u.fullName,
            extra: {
              avatar: u.getAvatar(),
            },
          })),
      },
      subdepartments: subs,
    };
  });

  const getOnSelectHandler = (): SelectHandler | MultiselectHandler => {
    if (selectProps) return selectProps.onSelect;

    if (multiselectProps) return multiselectProps.onSelect;

    throw new Error(
      'No selectProps nor multiselectProps were provided, unable to getOnSelectHandler'
    );
  };

  const ensureActive = (option: Option<number, { avatar: Avatar }>): boolean => {
    if (selectProps) return option.value === selectProps.selectedUserId;

    if (multiselectProps) return multiselectProps.selectedUserIds.includes(option.value);

    return false;
  };

  const selectWholeGroup = (option: DepartmentWithUsersOption, subIdx?: number): void => {
    if (!multiselectProps) return;

    if (subIdx !== undefined) {
      const subdepartment = option.subdepartments[subIdx];

      multiselectProps.onGroupSelect?.(subdepartment?.options ?? []);

      return;
    }

    const subdepartmentOptions = option.subdepartments.reduce<Option<number>[]>(
      (acc, sub) => [...acc, ...sub.options],
      []
    );
    const options: Option<number>[] = [...option.department.options, ...subdepartmentOptions];

    multiselectProps.onGroupSelect?.(options);
  };

  const withGroupSelection = Boolean(multiselectProps && multiselectProps.onGroupSelect);

  const isSearchBarShown = accessibleUsers.length >= 10;

  const moreThanOneSearchChar = searchModel.value.length > 1;

  const filteredWithoutDepartmentOptions = moreThanOneSearchChar
    ? usersWithoutDepartmentOptions.filter(o =>
        o.label.toLowerCase().includes(searchModel.value.toLowerCase())
      )
    : usersWithoutDepartmentOptions;

  const filteredWithDepartmentsOptions = moreThanOneSearchChar
    ? usersWithDepartmentsOptions.map<DepartmentWithUsersOption>(d => ({
        department: {
          ...d.department,
          options: d.department.options.filter(o =>
            o.label.toLowerCase().includes(searchModel.value.toLowerCase())
          ),
        },
        subdepartments: d.subdepartments.map<SubdepartmentWithUsersOption>(s => ({
          ...s,
          options: s.options.filter(o =>
            o.label.toLowerCase().includes(searchModel.value.toLowerCase())
          ),
        })),
      }))
    : usersWithDepartmentsOptions;

  const noOptions =
    !filteredWithoutDepartmentOptions.length &&
    filteredWithDepartmentsOptions.every(
      o => !o.department.options.length && o.subdepartments.every(s => !s.options.length)
    );

  const filter = moreThanOneSearchChar ? (searchModel.trimmedValue ?? null) : null;

  const allSelected = accessibleUsers.length === multiselectProps?.selectedUserIds.length;

  const toggleSelectAll = () => {
    if (!multiselectProps || !multiselectProps.onGroupSelect) return;

    if (usersMeta) {
      multiselectProps.onGroupSelect(
        accessibleUsers
          .filter(u => {
            const meta = usersMeta.find(m => m.id === u.id);

            if (meta) return meta.canSelect;

            return true;
          })
          .map<Option<number>>(u => ({
            value: u.id,
            label: u.fullName,
          }))
      );
    } else {
      multiselectProps.onGroupSelect(
        accessibleUsers.map<Option<number>>(u => ({ value: u.id, label: u.fullName }))
      );
    }
  };

  return (
    <Root>
      {isSearchBarShown && (
        <MySelectSearchBlock
          ref={searchInputRef}
          model={searchModel}
          handleClear={handleClearSearch}
        />
      )}

      <List $maxHeight={maxHeight} $minWidth={minWidth} $padding={padding}>
        {listTitle}

        {emptyUserOptionTitle && (
          <UserDropdownItem
            hoverable
            hideAvatar
            withBottomBorder
            title={emptyUserOptionTitle}
            active={
              selectProps?.selectedUserId === null ||
              multiselectProps?.selectedUserIds.length === 0 ||
              multiselectProps?.selectedUserIds[0] === -1
            }
            onClick={() =>
              selectProps
                ? (getOnSelectHandler() as SelectHandler)({
                    value: null,
                    label: emptyUserOptionTitle,
                  })
                : (getOnSelectHandler() as MultiselectHandler)({
                    value: -1,
                    label: emptyUserOptionTitle,
                  })
            }
          />
        )}

        {noOptions ? (
          <NoOptionsMessage>{t('no_options')}</NoOptionsMessage>
        ) : (
          <>
            {multiselectProps && accessibleUsers.length > 2 && (
              <SelectAllBlock
                height="44px"
                allSelected={allSelected}
                toggleSelectAll={toggleSelectAll}
              />
            )}

            {usersWithoutDepartmentOptions.length > 0 &&
              filteredWithoutDepartmentOptions.map(o => (
                <UserDropdownItem
                  key={o.value}
                  title={o.label}
                  filter={filter}
                  hoverable={hoverable}
                  avatar={o.extra?.avatar}
                  active={ensureActive(o)}
                  meta={usersMeta?.find(m => m.id === o.value)}
                  onClick={() => getOnSelectHandler()(o)}
                  renderExtra={() => renderExtra?.(o.value)}
                />
              ))}

            {filteredWithDepartmentsOptions.map(o =>
              showThisDepartment(o) ? (
                <Fragment key={o.department.id}>
                  <DepartmentItem
                    $hoverable={withGroupSelection}
                    onClick={() => selectWholeGroup(o)}
                  >
                    <IconWrapper>
                      <GroupIcon />
                    </IconWrapper>

                    <SpanWithEllipsis text={o.department.name} />
                  </DepartmentItem>

                  <Delimiter />

                  {o.department.options.map(o => (
                    <UserDropdownItem
                      key={o.value}
                      title={o.label}
                      filter={filter}
                      hoverable={hoverable}
                      active={ensureActive(o)}
                      avatar={o.extra?.avatar}
                      meta={usersMeta?.find(m => m.id === o.value)}
                      onClick={() => getOnSelectHandler()(o)}
                      renderExtra={() => renderExtra?.(o.value)}
                    />
                  ))}

                  {o.subdepartments.map((sub, subIdx) =>
                    showThisSubdepartment(sub) ? (
                      <Fragment key={sub.id}>
                        <SubdepartmentItem
                          $hoverable={withGroupSelection}
                          onClick={() => selectWholeGroup(o, subIdx)}
                        >
                          <IconWrapper>
                            <SubgroupIcon />
                          </IconWrapper>

                          <SpanWithEllipsis text={sub.name} />
                        </SubdepartmentItem>

                        {sub.options.map(o => (
                          <UserDropdownItem
                            key={o.value}
                            title={o.label}
                            filter={filter}
                            hoverable={hoverable}
                            avatar={o.extra?.avatar}
                            active={ensureActive(o)}
                            meta={usersMeta?.find(m => m.id === o.value)}
                            onClick={() => getOnSelectHandler()(o)}
                            renderExtra={() => renderExtra?.(o.value)}
                          />
                        ))}
                      </Fragment>
                    ) : null
                  )}
                </Fragment>
              ) : null
            )}
          </>
        )}
      </List>
    </Root>
  );
});

UserList.displayName = 'UserList';
export { UserList };
