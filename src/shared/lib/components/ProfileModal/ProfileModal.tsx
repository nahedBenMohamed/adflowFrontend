import {
  ChangeUserPasswordDto,
  generalSettingsStore,
  UpdateUserDto,
  UpdateUserProfileDto,
  UserProfileStore,
  userStore,
} from '@/app';
import { authStore } from '@/modules/auth';
import { FileSizeWarningModal, PhoneFormat } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AddPhotoIcon, TrashbinSmallIcon } from '../../../assets';
import { validateForm } from '../../helpers';
import { InputModel, SelectModel } from '../../models';
import type { Nullable } from '../../types';
import { AvatarUtil } from '../../utils';
import { PrimaryButton } from '../Buttons/PrimaryButton/PrimaryButton';
import { MyInput } from '../Form/Input/MyInput/MyInput';
import { MyInputWithLimitedLength } from '../Form/Input/MyInputWithLimitedLength/MyInputWithLimitedLength';
import { PhoneFieldInput } from '../Form/PhoneFieldInput/PhoneFieldInput';
import { DialogModalSecondary } from '../Modals/Dialog/DialogModalSecondary/DialogModalSecondary';
import { ImageEditModal } from '../Modals/ImageEditModal/ImageEditModal';
import { MyDatePickerSelect } from '../MyDatePicker/MyDatePickerSelect/MyDatePickerSelect';
import {
  AvatarBlock,
  AvatarButton,
  ChangePasswordBlock,
  FormWrapper,
  MainInfoBlock,
  MainInfoWrapper,
  ProfileModalFormGroup,
  ProfileModalSkeleton,
  SecondaryInfoBlock,
  type ChangePasswordForm,
} from './components';

const Avatar = styled.div`
  position: relative;

  width: 220px;
  height: 220px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 64px;
  font-weight: 700;
  color: var(--primary-statuses-white-0);

  overflow: hidden;
  border-radius: var(--border-radius-block);
  background: var(--button-text-graphite-primary-text);
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;

  height: 48px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 133.33%);
  border-radius: 0 0 var(--border-radius-block) var(--border-radius-block);
`;

const AvatarButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const AvatarAnnotation = styled.p`
  max-width: 220px;

  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);
`;

const AppVersion = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

// in bytes (5mb)
const PROFILE_PHOTO_MAX_SIZE = 5 * 1024 * 1024;

interface Props {
  isOpened: boolean;
  onClose: () => void;
}

interface InitialForm {
  firstName: InputModel;
  lastName: InputModel;
  email: InputModel;
  phone: InputModel;
  birthDate: SelectModel;
  employmentDate: SelectModel;
}

const IMAGE_SIZE = 220;
const NAME_MAX_LENGTH = 50;

const ProfileModal = observer((props: Props) => {
  const { isOpened, onClose } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'profile_modal',
  });

  const { accountSettings, clearApplicationCache } = generalSettingsStore;

  if (!accountSettings)
    throw new Error('Failed to open ProfileModal, accountSettings are not loaded');

  const inputRef = useRef<HTMLInputElement>(null);

  const { user: currentUser } = authStore;

  const userProfileStore = useMemo(() => new UserProfileStore(), []);
  const { userProfile } = userProfileStore;

  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState<Nullable<File>>(null);

  const [
    dateOfBirthDatePickerOpened,
    { close: closeDateOfBirthDatePicker, open: openDateOfBirthDatePicker },
  ] = useDisclosure();

  const [
    employmentStartDatePickerOpened,
    { close: closeEmploymentStartDatePicker, open: openEmploymentStartDatePicker },
  ] = useDisclosure();

  const [fileSizeWarningOpened, { open: openFileSizeWarning, close: closeFileSizeWarning }] =
    useDisclosure(false);

  const changePasswordForm = useLocalObservable<ChangePasswordForm>(() => ({
    current: InputModel.create().required(),
    new: InputModel.create().required(),
    confirm: InputModel.create().required(),
  }));

  const mainForm = useLocalObservable<InitialForm>(() => ({
    firstName: InputModel.create().required(),
    lastName: InputModel.create().required(),
    email: InputModel.create().required().email(),
    phone:
      accountSettings.phoneFormat === PhoneFormat.INTERNATIONAL
        ? InputModel.create().phoneInternational()
        : InputModel.create(),
    birthDate: SelectModel.create(),
    employmentDate: SelectModel.create(),
  }));

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (!currentUser) return;

      await userProfileStore.loadData(currentUser.id);

      const { userProfile } = userProfileStore;
      const currentUserData = userStore.getById(currentUser.id);

      if (!userProfile || !currentUserData)
        throw new Error(`User profile for user with id ${currentUser?.id} does not exists`);

      mainForm.firstName.setValue(currentUserData.firstName);
      mainForm.lastName.setValue(currentUserData.lastName || '');
      mainForm.email.setValue(currentUserData.email);

      if (currentUser.phone) mainForm.phone.setValue(currentUserData.phone || '');

      if (userProfile.birthDate) mainForm.birthDate.setValue(userProfile.birthDate);

      if (userProfile.employmentDate) mainForm.employmentDate.setValue(userProfile.employmentDate);
    };

    loadData();
  }, [currentUser, userProfileStore, mainForm]);

  const handleSave = async (): Promise<void> => {
    try {
      setSaving(true);

      if (!validateForm(mainForm) || !currentUser) return;

      const userDto = UpdateUserDto.fromExistingUser(currentUser);

      userDto.firstName = mainForm.firstName.value;
      userDto.lastName = mainForm.lastName.value;
      userDto.email = mainForm.email.value;
      userDto.phone = mainForm.phone.value;

      const profileDto = new UpdateUserProfileDto({
        birthDate: mainForm.birthDate.value?.formatISO() ?? null,
        employmentDate: mainForm.employmentDate.value?.formatISO() ?? null,
      });

      await userProfileStore.update({ id: currentUser.id, profileDto, userDto });

      // validate and change password
      if (changePasswordForm.current.trimmedValue.length === 0) {
        onClose();

        return;
      }

      if (!validateForm(changePasswordForm)) return;

      if (changePasswordForm.new.value !== changePasswordForm.confirm.value) {
        changePasswordForm.confirm.showError(t('passwords_do_not_match'));

        return;
      }

      const changePasswordDto = new ChangeUserPasswordDto({
        currentPassword: changePasswordForm.current.value,
        newPassword: changePasswordForm.new.value,
      });

      const passwordChangeResult = await userStore.changeUserPassword(changePasswordDto);

      if (!passwordChangeResult) {
        changePasswordForm.current.showError(t('incorrect_password'));

        return;
      }

      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files[0]) {
      if (files[0].size > PROFILE_PHOTO_MAX_SIZE) {
        openFileSizeWarning();

        return;
      }

      setImage(files[0]);

      target.value = '';
    }
  };

  const handleChangeAvatar = async (blob: Blob): Promise<void> => {
    if (!currentUser) throw new Error('Failed to change avatar, currentUser is not defined');

    await authStore.uploadUserAvatar({ userId: currentUser.id, blob });

    userStore.updateUserAvatar({ id: currentUser.id, avatarUrl: currentUser.avatarUrl });

    setImage(null);
  };

  const removeUserAvatar = async (): Promise<void> => {
    if (!currentUser) throw new Error('Failed to change avatar, currentUser is not defined');

    await authStore.removeUserAvatar(currentUser.id);

    userStore.updateUserAvatar({ id: currentUser.id, avatarUrl: currentUser.avatarUrl });
  };

  const handleCloseImageEditModal = () => setImage(null);

  const appVersion = __APP_VERSION__;

  return (
    <>
      <DialogModalSecondary
        width="800px"
        loading={saving}
        maxHeight="700px"
        isOpened={isOpened}
        Header={t('profile')}
        approveDisabled={saving}
        onClose={onClose}
        onApprove={handleSave}
      >
        {currentUser && userProfile ? (
          <>
            <MainInfoBlock>
              <AvatarBlock>
                <Avatar>
                  {currentUser.avatarUrl ? (
                    <img
                      width={IMAGE_SIZE}
                      height={IMAGE_SIZE}
                      alt={`${currentUser.firstName} ${t('avatar')}`}
                      src={`${currentUser.avatarUrl}?width=${IMAGE_SIZE * 2}&height=${IMAGE_SIZE * 2}`}
                    />
                  ) : (
                    AvatarUtil.extractInitials(currentUser.firstName, currentUser.lastName)
                  )}

                  <Overlay>
                    {currentUser.avatarUrl ? (
                      <AvatarButtonsWrapper>
                        <AvatarButton
                          Icon={<AddPhotoIcon />}
                          onClick={() => inputRef.current?.click()}
                        >
                          {t('change_avatar')}
                        </AvatarButton>

                        <AvatarButton Icon={<TrashbinSmallIcon />} onClick={removeUserAvatar}>
                          {t('delete_avatar')}
                        </AvatarButton>
                      </AvatarButtonsWrapper>
                    ) : (
                      <AvatarButton
                        Icon={<AddPhotoIcon />}
                        onClick={() => inputRef.current?.click()}
                      >
                        {t('add_avatar')}
                      </AvatarButton>
                    )}

                    <HiddenInput
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSelectFile}
                    />
                  </Overlay>
                </Avatar>

                <AvatarAnnotation>{t('avatar_annotation')}</AvatarAnnotation>
              </AvatarBlock>

              <MainInfoWrapper>
                <ProfileModalFormGroup label={t('first_name')}>
                  <MyInputWithLimitedLength
                    variant="outlined"
                    model={mainForm.firstName}
                    maxLength={NAME_MAX_LENGTH}
                    hint={t('first_name_hint', { length: NAME_MAX_LENGTH })}
                  />
                </ProfileModalFormGroup>

                <ProfileModalFormGroup label={t('last_name')}>
                  <MyInputWithLimitedLength
                    variant="outlined"
                    model={mainForm.lastName}
                    maxLength={NAME_MAX_LENGTH}
                    hint={t('last_name_hint', { length: NAME_MAX_LENGTH })}
                  />
                </ProfileModalFormGroup>
              </MainInfoWrapper>
            </MainInfoBlock>

            <SecondaryInfoBlock>
              <FormWrapper>
                <ProfileModalFormGroup label={t('date_of_birth')}>
                  <MyDatePickerSelect
                    withinPortal
                    type="default"
                    model={mainForm.birthDate}
                    variant="empty-without-arrow"
                    opened={dateOfBirthDatePickerOpened}
                    show={openDateOfBirthDatePicker}
                    hide={closeDateOfBirthDatePicker}
                  />
                </ProfileModalFormGroup>

                <ProfileModalFormGroup label={t('phone')}>
                  <PhoneFieldInput model={mainForm.phone} />
                </ProfileModalFormGroup>

                <ProfileModalFormGroup label={t('employment_start')}>
                  <MyDatePickerSelect
                    withinPortal
                    type="default"
                    model={mainForm.employmentDate}
                    variant="empty-without-arrow"
                    opened={employmentStartDatePickerOpened}
                    show={openEmploymentStartDatePicker}
                    hide={closeEmploymentStartDatePicker}
                  />
                </ProfileModalFormGroup>

                <ProfileModalFormGroup label={t('email')}>
                  <MyInput model={mainForm.email} variant="outlined" />
                </ProfileModalFormGroup>

                {appVersion && (
                  <ProfileModalFormGroup label={t('app_version')} hint={t('app_version_hint')}>
                    <AppVersion>{appVersion}</AppVersion>
                  </ProfileModalFormGroup>
                )}

                <ProfileModalFormGroup label={t('clear_cache')} hint={t('clear_cache_hint')}>
                  <PrimaryButton variant="outlined" onClick={clearApplicationCache}>
                    {t('clear_cache_title')}
                  </PrimaryButton>
                </ProfileModalFormGroup>
              </FormWrapper>

              <ChangePasswordBlock form={changePasswordForm} />
            </SecondaryInfoBlock>
          </>
        ) : (
          <ProfileModalSkeleton />
        )}
      </DialogModalSecondary>

      <ImageEditModal
        round
        width={220}
        height={220}
        image={image}
        title={t('upload_avatar')}
        annotation={t('image_edit_modal.annotation')}
        onApprove={handleChangeAvatar}
        onClose={handleCloseImageEditModal}
      />

      {fileSizeWarningOpened && (
        <FileSizeWarningModal
          maxSizeMb={5}
          isOpened={fileSizeWarningOpened}
          onClose={closeFileSizeWarning}
        />
      )}
    </>
  );
});

ProfileModal.displayName = 'ProfileModal';
export { ProfileModal };
