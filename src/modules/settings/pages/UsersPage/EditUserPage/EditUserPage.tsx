import { appStore, generalSettingsStore, routes, userStore } from '@/app';
import { authStore } from '@/modules/auth';
import { RequestSetupFormButton, useGetDepartmentSettings } from '@/modules/settings';
import {
  DeleteButton,
  DepartmentsSelect,
  ErrorCode,
  Hint,
  MiniLoader,
  MyCheckbox,
  MyInput,
  MyInputNumber,
  MyInputWithLimitedLength,
  MySelect,
  MyTimePickerInput,
  PhoneFieldInput,
  PlusIconButton,
  UserRole,
  UsersMultiselect,
  WarningIcon,
  WeekIntervalsInput,
  envUtil,
  useTypedParams,
  type MyTimePickerInputProps,
  type Nullable,
  type Option,
  type Optional,
  type ServiceError,
  type User,
} from '@/shared';
import { Transition } from '@mantine/core';
import type { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
  type CSSProperties,
  type ChangeEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { EditUserStore, departmentsSettingsStore } from '../../../store';
import { SettingsPageTemplate } from '../../../templates';
import { HeaderButton } from '../UsersSettingsPage/components';
import { EditUserFormGroup, EditUserPageGrid, ObjectPermissionsList } from './components';

const Form = styled.form<{ $gridColumn: CSSProperties['gridColumn'] }>`
  display: flex;
  flex-direction: column;
  grid-column: ${p => p.$gridColumn};

  padding: 24px 32px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
`;

const FormTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--button-text-graphite-primary-text);
`;

const UserCalendarHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 16px;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  color: var(--button-text-graphite-priory-text);

  margin: 0 105px 0 0;

  &:hover {
    cursor: pointer;
  }
`;

const CheckboxLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  color: var(--button-text-red-default);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  margin-bottom: 16px;
`;

const WarningIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const WorkingTimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WorkingTimePickerWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
`;

const Bulkhead = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: var(--button-text-graphite-primary-text);
`;

const NAME_MAX_LENGTH = 50;

const EditUserPage = observer(() => {
  const { id } = useTypedParams<{ id: number }>();

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.edit_user_page',
  });

  const navigate = useNavigate();

  const { user: currentUser } = authStore;

  const { accountSettings } = generalSettingsStore;

  const [saving, setSaving] = useState(false);
  const [savingAndAdding, setSavingAndAdding] = useState(false);

  const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null);
  const [user, setUser] = useState<Nullable<User>>(null);
  const [formInitialized, setFormInitialized] = useState(false);

  const [storeKey, clearStore] = useReducer(x => ++x, 0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const editUserStore = useMemo(() => new EditUserStore(), [storeKey]);

  const {
    role,
    position,
    userCalendar,
    departmentId,
    addUserPassword,
    updateUserPassword,
    accessibleUserIds,
    workingTimeFrom,
    workingTimeTo,
    inheritWorkingTime,
    validate,
    setUser: setStoreUser,
    addUser,
    updateUser,
  } = editUserStore;

  useLayoutEffect(() => {
    if (!user) return;

    const loadUser = async (): Promise<void> => {
      const { hasDepartment, hasSubdepartment } = departmentsSettingsStore.checkDepartments(user);
      await setStoreUser({ user, hasDepartment, hasSubdepartment });

      setFormInitialized(true);
    };

    loadUser();
  }, [user, setStoreUser]);

  if (id && user === null && appStore.isLoaded) setUser(userStore.getById(id));

  const { data: departmentSettings } = useGetDepartmentSettings({
    departmentId: departmentId.value as Nullable<number>,
    enabled: departmentId.value !== null,
  });

  useEffect(() => {
    if (inheritWorkingTime.value) {
      if (
        departmentSettings &&
        departmentSettings.workingTimeFrom &&
        departmentSettings.workingTimeTo
      ) {
        workingTimeFrom.setValue(departmentSettings.workingTimeFrom);
        workingTimeTo.setValue(departmentSettings.workingTimeTo);
      } else if (accountSettings?.workingTimeFrom && accountSettings?.workingTimeTo) {
        workingTimeFrom.setValue(accountSettings.workingTimeFrom);
        workingTimeTo.setValue(accountSettings.workingTimeTo);
      }
    }
  }, [
    departmentSettings,
    accountSettings,
    workingTimeFrom,
    workingTimeTo,
    inheritWorkingTime.value,
  ]);

  const handleAddUser = async (type: 'save' | 'save_and_add'): Promise<void> => {
    if (!validate()) return;

    try {
      type === 'save' ? setSaving(true) : setSavingAndAdding(true);

      if (!user) {
        await addUser();
      } else {
        await updateUser(user.id);

        if (currentUser && user.id === currentUser.id) authStore.invalidateCurrentUserInCache();
      }
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      switch (serviceError?.errorCode) {
        case ErrorCode.EMAIL_OCCUPIED: {
          setErrorMessage(t('email_error', { company: envUtil.appName }));

          break;
        }

        default:
          setErrorMessage(t('unknown_error'));
      }

      return;
    } finally {
      type === 'save' ? setSaving(false) : setSavingAndAdding(false);
    }

    if (type === 'save') {
      navigate(routes.settingsUsers());

      return;
    }

    clearStore();
    navigate(routes.settingsUsersAdd());
  };

  const handleClearDepartmentValue = () => {
    departmentId.setValue(null);
  };

  const onAdminCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      editUserStore.role.value = UserRole.ADMIN;

      return;
    }

    editUserStore.role.value = UserRole.USER;
  };

  const pickerDropdownProps = useMemo<MyTimePickerInputProps['pickerDropdownProps']>(
    () => ({
      step: 30,
      inModal: true,
      withinPortal: true,
      position: 'bottom-start',
    }),
    []
  );

  const durationOptions = useMemo<Option[]>(
    () => [
      {
        value: 0,
        label: t('no_duration'),
      },
      {
        value: 300,
        label: `5 ${t('minutes')}`,
      },
      {
        value: 420,
        label: `7 ${t('minutes')}`,
      },
      {
        value: 600,
        label: `10 ${t('minutes')}`,
      },
      {
        value: 900,
        label: `15 ${t('minutes')}`,
      },
    ],
    [t]
  );

  return (
    <SettingsPageTemplate
      pageTitleKey="settings.user_edit"
      Controls={
        appStore.isLoaded && editUserStore.areWarehouseStoresLoaded ? (
          <>
            <HeaderButton disabled={saving} onClick={() => handleAddUser('save')}>
              {t('save')} {saving && <MiniLoader />}
            </HeaderButton>

            {!user && (
              <HeaderButton
                $inversed
                $padding="8px 0"
                disabled={savingAndAdding}
                onClick={() => handleAddUser('save_and_add')}
              >
                {t('save_and_add')}

                {savingAndAdding && <MiniLoader color="var(--primary-statuses-green-520)" />}
              </HeaderButton>
            )}

            <RequestSetupFormButton titleKey="request_setup" />
          </>
        ) : (
          <MiniLoader color="var(--primary-statuses-green-520)" />
        )
      }
    >
      <Transition mounted={Boolean(errorMessage)} transition="pop">
        {transitionStyles => (
          <ErrorWrapper style={{ ...transitionStyles }}>
            <WarningIconWrapper>
              <WarningIcon />
            </WarningIconWrapper>

            {errorMessage}
          </ErrorWrapper>
        )}
      </Transition>

      <EditUserPageGrid>
        {/* form containing "search" in id is a hack to prevent LastPass from autofilling this form */}
        {(formInitialized || !user) && (
          <>
            <Form $gridColumn={1} autoComplete="off" id="amwork_EditUserPage--search">
              <EditUserFormGroup text={t('first_name')}>
                <MyInputWithLimitedLength
                  variant="outlined"
                  disableAutocomplete
                  maxLength={NAME_MAX_LENGTH}
                  model={editUserStore.firstName}
                  hint={t('first_name_hint', { length: NAME_MAX_LENGTH })}
                />
              </EditUserFormGroup>

              <EditUserFormGroup text={t('last_name')}>
                <MyInputWithLimitedLength
                  variant="outlined"
                  disableAutocomplete
                  maxLength={NAME_MAX_LENGTH}
                  model={editUserStore.lastName}
                  hint={t('last_name_hint', { length: NAME_MAX_LENGTH })}
                />
              </EditUserFormGroup>

              <EditUserFormGroup text={t('phone_number')}>
                <PhoneFieldInput
                  disableAutocomplete
                  alwaysInternational
                  model={editUserStore.phone}
                />
              </EditUserFormGroup>

              <EditUserFormGroup text={t('email')}>
                <MyInput
                  type="email"
                  variant="outlined"
                  disableAutocomplete
                  model={editUserStore.email}
                  placeholder="name@company.com"
                />
              </EditUserFormGroup>

              <EditUserFormGroup text={t('password')}>
                <MyInput
                  type="password"
                  variant="outlined"
                  disableAutocomplete
                  model={user ? updateUserPassword : addUserPassword}
                  placeholder={user ? t('placeholders.new_password') : t('placeholders.password')}
                />
              </EditUserFormGroup>

              {departmentsSettingsStore.departments.length > 0 && (
                <EditUserFormGroup text={t('group')}>
                  <DepartmentsSelect
                    withinPortal
                    model={departmentId}
                    variant="outlined-without-active-shadow"
                    departments={departmentsSettingsStore.departments}
                    onClear={handleClearDepartmentValue}
                  />
                </EditUserFormGroup>
              )}

              {/* We can not configure accessibleUserIds for the owner */}
              {user && user.isOwner() ? null : (
                <EditUserFormGroup text={t('visible_users')} hint={t('visible_users_hint')}>
                  <UsersMultiselect
                    withinPortal
                    ignoreAccessibleUsers
                    model={accessibleUserIds}
                    users={
                      user
                        ? userStore.activeUsers.filter(u => u.id !== user.id)
                        : userStore.activeUsers
                    }
                    variant="outlined-without-active-shadow"
                    placeholder={t('placeholders.all_users')}
                  />
                </EditUserFormGroup>
              )}

              <EditUserFormGroup text={t('position')}>
                <MyInput
                  model={position}
                  variant="outlined"
                  disableAutocomplete
                  placeholder={t('placeholders.manager')}
                />
              </EditUserFormGroup>

              {/* Mock group just for the display purposes */}
              <EditUserFormGroup text="">
                <CheckboxWrapper>
                  {role.value === UserRole.OWNER ? (
                    <>
                      <MyCheckbox checked disabled gray />

                      <CheckboxLabelWrapper>
                        {t('owner')}
                        <Hint text={t('owner_hint')} />
                      </CheckboxLabelWrapper>
                    </>
                  ) : (
                    <>
                      <MyCheckbox
                        checked={role.value === UserRole.ADMIN}
                        onChange={onAdminCheckboxChange}
                      />

                      <CheckboxLabelWrapper>
                        {t('admin')}
                        <Hint text={t('admin_hint')} />
                      </CheckboxLabelWrapper>
                    </>
                  )}
                </CheckboxWrapper>
              </EditUserFormGroup>

              <EditUserFormGroup text={t('working_time')}>
                <WorkingTimeWrapper>
                  <WorkingTimePickerWrapper>
                    <MyTimePickerInput
                      fullWidth
                      disabled={inheritWorkingTime.value}
                      pickerDropdownProps={pickerDropdownProps}
                      model={workingTimeFrom}
                    />

                    <Bulkhead>{t('to')}</Bulkhead>

                    <MyTimePickerInput
                      fullWidth
                      disabled={inheritWorkingTime.value}
                      pickerDropdownProps={pickerDropdownProps}
                      model={workingTimeTo}
                    />
                  </WorkingTimePickerWrapper>

                  <CheckboxWrapper>
                    <MyCheckbox
                      checked={inheritWorkingTime.value}
                      onChange={inheritWorkingTime.toggle}
                    />

                    <CheckboxLabelWrapper>
                      {t('group_working_time')}
                      <Hint text={t('group_working_time_hint')} />
                    </CheckboxLabelWrapper>
                  </CheckboxWrapper>
                </WorkingTimeWrapper>
              </EditUserFormGroup>
            </Form>

            <Form $gridColumn={2}>
              <UserCalendarHeaderWrapper>
                <FormTitleWrapper>
                  <FormTitle>{t('user_calendar_title')}</FormTitle>

                  <Hint text={t('user_calendar_hint')} />
                </FormTitleWrapper>

                {editUserStore.userCalendar.isCalendarEnabled && (
                  <DeleteButton
                    text={t('delete_user_calendar')}
                    onClick={editUserStore.userCalendar.disableCalendar}
                  />
                )}
              </UserCalendarHeaderWrapper>

              {!editUserStore.userCalendar.isCalendarEnabled ? (
                <PlusIconButton
                  isGreen
                  text={t('add_user_calendar')}
                  onClick={editUserStore.userCalendar.enableCalendar}
                />
              ) : (
                <>
                  <EditUserFormGroup text={t('time_buffer_before')}>
                    <MySelect
                      variant="outlined"
                      options={durationOptions}
                      model={userCalendar.timeBufferBefore}
                    />
                  </EditUserFormGroup>

                  <EditUserFormGroup text={t('time_buffer_after')}>
                    <MySelect
                      variant="outlined"
                      options={durationOptions}
                      model={userCalendar.timeBufferAfter}
                    />
                  </EditUserFormGroup>

                  <EditUserFormGroup text={t('appointment_limit')}>
                    <MyInputNumber
                      min={1}
                      variant="outlined"
                      model={userCalendar.appointmentLimit}
                      placeholder="5"
                    />
                  </EditUserFormGroup>

                  <EditUserFormGroup text={t('schedule')}>
                    <WeekIntervalsInput model={userCalendar.intervals} />
                  </EditUserFormGroup>
                </>
              )}
            </Form>
          </>
        )}

        {role.value === UserRole.USER && (formInitialized || !user) && (
          <ObjectPermissionsList editUserStore={editUserStore} />
        )}
      </EditUserPageGrid>
    </SettingsPageTemplate>
  );
});

EditUserPage.displayName = 'EditUserPage';
export { EditUserPage };
