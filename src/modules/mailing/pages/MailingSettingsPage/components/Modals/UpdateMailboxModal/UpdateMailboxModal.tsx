import { userStore } from '@/app';
import { authStore } from '@/modules/auth';
import { EntitySettingsFormGroup, EntitySettingsStore } from '@/modules/settings';
import {
  BooleanModel,
  DefaultLoader,
  DeleteButton,
  DialogModalSecondary,
  Hint,
  InputModel,
  MultiselectModel,
  MyCheckbox,
  MyCheckboxWithBooleanModel,
  MyInput,
  MySelect,
  MyUsersSelect,
  PrimaryButton,
  SelectModel,
  UsersMultiselect,
  validateForm,
  type Nullable,
  type Option,
  type User,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useLayoutEffect, useState, type ChangeEvent, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  UpdateMailboxDto,
  UpdateMailboxSettingsManualDto,
  type UpdateMailboxSettingsResult,
} from '../../../../../api';
import {
  GmailIcon,
  ReconnectIcon,
  type Mailbox,
  type MailboxSettingsManual,
} from '../../../../../shared';
import { mailboxSettingsStore } from '../../../../../store';
import { Caption } from '../../Caption/Caption';
import { DeleteMailboxModal } from '../DeleteMailboxModal/DeleteMailboxModal';
import { ModalTitle } from '../ModalTitle/ModalTitle';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 24px 32px;
`;

const EmailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EmailInputWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const GroupWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BottomBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CheckboxWrapperLabel = styled.label<{ $marginTop?: CSSProperties['marginTop'] }>`
  display: flex;
  gap: 8px;

  margin-top: ${p => p.$marginTop};
`;

const CheckboxCaption = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);
`;

const CheckboxGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoaderWrapper = styled.div`
  margin: 128px auto;
`;

const DeleteButtonWrapper = styled.div`
  margin-right: auto;
`;

const EmailsPerDayWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EmailsPerDayAnnotationWrapper = styled(Caption)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  mailbox: Mailbox;
  isOpened: boolean;
  isEdit?: boolean;
  onClose: () => void;
  handleReconnectGmail: (id: number) => Promise<void>;
  updateMailbox: ({ id, dto }: { id: number; dto: UpdateMailboxDto }) => Promise<void>;
  updateManualSettings?: ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateMailboxSettingsManualDto;
  }) => Promise<UpdateMailboxSettingsResult>;
}

interface ManualSettingsInitialForm {
  imapSecure: BooleanModel;
  smtpSecure: BooleanModel;
  password: InputModel;
  imapPort: InputModel;
  smtpPort: InputModel;
  imapServer: InputModel;
  smtpServer: InputModel;
}

interface MailboxInitialForm {
  email: InputModel;
  ownerId: SelectModel;
  syncDays: InputModel;
  emailsPerDay: SelectModel;
  entitySettings: EntitySettingsStore;
  accessibleUserIds: MultiselectModel<number>;
}

const PORT_INPUT_WIDTH = '120px';
const DEFAULT_EMAILS_PER_DAY = 100;

const UpdateMailboxModal = observer((props: Props) => {
  const { mailbox, isOpened, onClose, updateMailbox, handleReconnectGmail, updateManualSettings } =
    props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_settings_page.modals.update_mailbox_modal',
  });

  const currentUser = authStore.user;
  const users = userStore.activeUsers;

  const owner = mailbox.ownerId ? userStore.getById(mailbox.ownerId) : null;

  const getUsersToDisplay = () => {
    if (owner) return owner.id;

    if (currentUser) return currentUser.id;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [usersWithoutOwner, setUsersWithoutOwner] = useState<User[]>([]);

  const isManual = mailbox.isManual();
  const isGmail = mailbox.isGmail();

  const [areSettingsLoaded, setAreSettingsLoaded] = useState(false);

  const [isDeleteModalOpened, { close: hideDeleteModal, open: showDeleteModal }] =
    useDisclosure(false);
  const [settingsError, setSettingsError] = useState<Nullable<string>>(null);

  const manualSettingsForm = useLocalObservable<ManualSettingsInitialForm>(() => ({
    imapSecure: BooleanModel.create(true),
    smtpSecure: BooleanModel.create(true),
    password: InputModel.create(),
    imapPort: InputModel.create().required(),
    smtpPort: InputModel.create().required(),
    imapServer: InputModel.create().required(),
    smtpServer: InputModel.create().required(),
  }));

  const usersToDisplay = getUsersToDisplay();

  const mailboxForm = useLocalObservable<MailboxInitialForm>(() => ({
    email: InputModel.create(mailbox.email),
    ownerId: SelectModel.create(getUsersToDisplay()),
    entitySettings: new EntitySettingsStore(mailbox.entitySettings),
    syncDays: InputModel.createFromNullableNumber(mailbox.syncDays),
    emailsPerDay: SelectModel.create(mailbox.emailsPerDay ?? DEFAULT_EMAILS_PER_DAY),
    accessibleUserIds: MultiselectModel.create<number>(
      mailbox.accessibleUserIds && mailbox.accessibleUserIds.length > 0
        ? mailbox.accessibleUserIds
        : usersToDisplay
          ? [usersToDisplay]
          : []
    ),
  }));

  useLayoutEffect(() => {
    const loadData = async (): Promise<void> => {
      if (!isManual) {
        setAreSettingsLoaded(true);

        return;
      }

      try {
        setAreSettingsLoaded(false);

        const settings = await mailboxSettingsStore.getMailboxSettingsManual(mailbox.id);

        manualSettingsForm.imapServer.value = settings.imapServer;
        manualSettingsForm.imapPort.value = String(settings.imapPort);
        manualSettingsForm.imapSecure.value = settings.imapSecure;

        manualSettingsForm.smtpServer.value = settings.smtpServer;
        manualSettingsForm.smtpPort.value = String(settings.smtpPort);
        manualSettingsForm.smtpSecure.value = settings.smtpSecure;
      } catch (e) {
        throw new Error(
          `Error while loading mailbox ${mailbox.id} settings in UpdateMailboxModal: ${e}`
        );
      } finally {
        setAreSettingsLoaded(true);
      }
    };

    loadData();
  }, [isManual, mailbox.id, manualSettingsForm]);

  useEffect(() => {
    const { ownerId } = mailboxForm;

    if (!ownerId.value) return;

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setUsersWithoutOwner(users.filter(u => u.id !== ownerId.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailboxForm.ownerId.value, mailboxForm]);

  const handleApprove = async (): Promise<void> => {
    try {
      setIsLoading(true);

      let response: Nullable<{ result: boolean; state: MailboxSettingsManual | string }> = null;

      if (isManual && updateManualSettings) {
        if (!validateForm(manualSettingsForm)) return;

        const dto = new UpdateMailboxSettingsManualDto({
          email: mailboxForm.email.trimmedValue,
          imapSecure: manualSettingsForm.imapSecure.value,
          smtpSecure: manualSettingsForm.smtpSecure.value,
          password: manualSettingsForm.password.trimmedValue,
          imapServer: manualSettingsForm.imapServer.trimmedValue,
          smtpServer: manualSettingsForm.smtpServer.trimmedValue,
          imapPort: Number(manualSettingsForm.imapPort.trimmedValue),
          smtpPort: Number(manualSettingsForm.smtpPort.trimmedValue),
        });

        response = await updateManualSettings({ id: mailbox.id, dto });
      }

      if (!response || response.result) {
        const dto = new UpdateMailboxDto({
          email: mailboxForm.email.value,
          ownerId: mailboxForm.ownerId.value,
          syncDays: mailboxForm.syncDays.asNumberOrNull(),
          entitySettings: mailboxForm.entitySettings.updateDto,
          accessibleUserIds: mailboxForm.accessibleUserIds.values,
          emailsPerDay: mailboxForm.emailsPerDay.value ?? DEFAULT_EMAILS_PER_DAY,
        });

        await updateMailbox({ id: mailbox.id, dto });

        onClose();
      } else if (response && !response.result && typeof response.state === 'string') {
        setSettingsError(response.state);
      }
    } catch (e) {
      if (e instanceof Error) setSettingsError(e.message);

      console.error('Error while updating mailbox', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (save: boolean) => {
    await mailboxSettingsStore.deleteMailbox({ id: mailbox.id, save });

    onClose();
  };

  const handleChangeSyncDaysCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { syncDays } = mailboxForm;

    if (e.target.value) {
      syncDays.value = '';

      return;
    }

    syncDays.setNumberValue(7);
  };

  const emailsPerDayOptions = [
    ...Array.from({ length: 15 }, (_, i) => i + 1).map<Option<number>>(i => ({
      label: `${i * 100}`,
      value: i * 100,
    })),
  ];

  return (
    <DialogModalSecondary
      width="100%"
      maxWidth="520px"
      isOpened={isOpened}
      loading={isLoading}
      approveDisabled={isLoading}
      errorMessage={settingsError}
      maxHeight={isGmail ? '532px' : '688px'}
      Header={<ModalTitle>{t('title_edit')}</ModalTitle>}
      LeftControls={
        <DeleteButtonWrapper>
          <DeleteButton text={t('delete')} onClick={showDeleteModal} />
        </DeleteButtonWrapper>
      }
      onClose={onClose}
      onApprove={handleApprove}
    >
      <Root>
        {areSettingsLoaded ? (
          <>
            <EmailWrapper>
              <EmailInputWrapper title={t('email_readonly_title')}>
                <MyInput variant="outlined" model={mailboxForm.email} disabled />
                {isGmail && <GmailIcon />}
              </EmailInputWrapper>

              {isGmail && handleReconnectGmail && (
                <PrimaryButton
                  padding={0}
                  height={20}
                  variant="empty"
                  iconProps={{
                    Icon: <ReconnectIcon />,
                    path: {
                      pathFillHover: 'var(--button-text-graphite-primary-text)',
                    },
                  }}
                  onClick={() => handleReconnectGmail(mailbox.id)}
                >
                  {t('reconnect')}
                </PrimaryButton>
              )}
            </EmailWrapper>

            {isManual && (
              <>
                <MyInput
                  type="password"
                  variant="outlined"
                  disableAutocomplete
                  model={manualSettingsForm.password}
                  placeholder={t('placeholders.password')}
                />

                <GroupWrapper>
                  <MyInput
                    variant="outlined"
                    disableAutocomplete
                    placeholder={t('placeholders.imap')}
                    model={manualSettingsForm.imapServer}
                  />

                  <MyInput
                    type="number"
                    variant="outlined"
                    disableAutocomplete
                    hideNumberInputControls
                    width={PORT_INPUT_WIDTH}
                    model={manualSettingsForm.imapPort}
                    placeholder={t('placeholders.port')}
                  />

                  <CheckboxWrapperLabel>
                    <MyCheckboxWithBooleanModel model={manualSettingsForm.imapSecure} />

                    <CheckboxCaption>{t('encryption')}</CheckboxCaption>
                  </CheckboxWrapperLabel>
                </GroupWrapper>

                <GroupWrapper>
                  <MyInput
                    variant="outlined"
                    disableAutocomplete
                    placeholder={t('placeholders.smtp')}
                    model={manualSettingsForm.smtpServer}
                  />

                  <MyInput
                    type="number"
                    variant="outlined"
                    disableAutocomplete
                    hideNumberInputControls
                    width={PORT_INPUT_WIDTH}
                    model={manualSettingsForm.smtpPort}
                    placeholder={t('placeholders.port')}
                  />

                  <CheckboxWrapperLabel>
                    <MyCheckboxWithBooleanModel model={manualSettingsForm.smtpSecure} />

                    <CheckboxCaption>{t('encryption')}</CheckboxCaption>
                  </CheckboxWrapperLabel>
                </GroupWrapper>
              </>
            )}

            <SelectWrapper>
              <Caption $gray>{t('owner')}</Caption>

              <MyUsersSelect
                withinPortal
                variant="outlined"
                model={mailboxForm.ownerId}
                users={userStore.activeUsers}
                placeholder={t('placeholders.owner')}
              />
            </SelectWrapper>

            <SelectWrapper>
              <Caption $gray>{t('for_whom_available')}</Caption>

              <UsersMultiselect
                withinPortal
                variant="outlined"
                users={usersWithoutOwner}
                model={mailboxForm.accessibleUserIds}
              />
            </SelectWrapper>

            <SelectWrapper>
              <Caption $gray>{t('max_number_of_emails_per_day')}</Caption>

              <EmailsPerDayWrapper>
                <MySelect
                  width="70px"
                  withinPortal
                  titleGap="8px"
                  titleMinWidth={0}
                  searchBar={false}
                  variant="outlined"
                  options={emailsPerDayOptions}
                  model={mailboxForm.emailsPerDay}
                />

                <EmailsPerDayAnnotationWrapper>
                  {t('emails_per_day')} <Hint text={t('emails_per_day_hint')} />
                </EmailsPerDayAnnotationWrapper>
              </EmailsPerDayWrapper>
            </SelectWrapper>

            <BottomBlock>
              <CheckboxGroupWrapper>
                {mailbox.isInDraftState() && (
                  <CheckboxWrapperLabel>
                    <MyCheckbox
                      value={mailboxForm.syncDays.value}
                      checked={Boolean(mailboxForm.syncDays.value)}
                      onChange={handleChangeSyncDaysCheckbox}
                    />

                    <CheckboxCaption>{t('synchronize')}</CheckboxCaption>
                  </CheckboxWrapperLabel>
                )}
              </CheckboxGroupWrapper>

              <EntitySettingsFormGroup
                entitySettingsStore={mailboxForm.entitySettings}
                customAnnotation={t('create_entities_annotation')}
                customCreateEntitiesLabel={t('create_entities_label')}
              />
            </BottomBlock>

            {isDeleteModalOpened && (
              <DeleteMailboxModal
                isOpened={isDeleteModalOpened}
                onApprove={handleDelete}
                onClose={hideDeleteModal}
              />
            )}
          </>
        ) : (
          <LoaderWrapper>
            <DefaultLoader />
          </LoaderWrapper>
        )}
      </Root>
    </DialogModalSecondary>
  );
});

UpdateMailboxModal.displayName = 'UpdateMailboxModal';
export { UpdateMailboxModal };
