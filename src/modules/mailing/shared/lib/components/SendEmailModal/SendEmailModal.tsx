import { SettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  DropdownScrollbarMixin,
  FileInput,
  FileModel,
  Hint,
  InputModel,
  MiniLoader,
  MixedFileList,
  ModalCloseCrossTertiaryIcon,
  MultiselectModel,
  MyCheckbox,
  MyDropdown,
  MyDropdownList,
  MyInput,
  OverlayingModal,
  UuidUtil,
  envUtil,
  useUploadFiles,
  type FTEShowHTMLProps,
  type FileItemModel,
  type FileLink,
  type Nullable,
  type Option,
  type Optional,
} from '@/shared';
import { FocusTrap } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { SendMailMessageDto } from '../../../../api';
import { MailMessageStore, MailboxStore } from '../../../../store';
import type { MailboxSignature, SendEmailModalSettings } from '../../models';
import {
  ChangesNotSavedModal,
  EmailSignatureEditor,
  EmailTextEditor,
  InputWrapper,
  InvalidEmailAddressModal,
  MultiAddressMailField,
  PseudoInputLabel,
  PseudoInputLabelWrapper,
  PseudoInputWrapper,
  SendEmailSettingsDropdown,
  TextFormatButton,
} from './components';

const Root = styled.div`
  width: 100%;
  height: 100%;
  max-width: 872px;
  max-height: 720px;

  display: flex;
  flex-direction: column;
  overflow: hidden;

  border-radius: var(--border-radius-modal);
  background-color: var(--primary-statuses-white-0);
  box-shadow:
    0px 101px 40px rgba(146, 151, 176, 0.01),
    0px 57px 34px rgba(146, 151, 176, 0.05),
    0px 25px 25px rgba(146, 151, 176, 0.09),
    0px 6px 14px rgba(146, 151, 176, 0.1),
    0px 0px 0px rgba(146, 151, 176, 0.1);
`;

const Header = styled.div`
  position: relative;

  padding: 14px 24px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const HeaderTitleWrapper = styled.div<{ $iconColor?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${p =>
    p.$iconColor &&
    css<{ $iconColor?: string }>`
      svg path {
        fill: ${p => p.$iconColor};
      }
    `}
`;

const CloseIconWrapper = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;

  overflow-y: auto;

  ${DropdownScrollbarMixin}

  padding: 16px 24px;
`;

const InputLabel = styled.span`
  position: absolute;
  left: 0;

  color: var(--button-text-graphite-primary-text);
`;

const PseudoInputContent = styled.div<{ $hoverable?: boolean }>`
  color: var(--primary-blue);

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;

        color: var(--button-text-blue-hover);
      }

      &:active {
        color: var(--button-text-blue-active);
      }
    `}
`;

const AttachmentsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AttachmentsBlockTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);
`;

const DeleteAllButton = styled.button`
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    text-decoration: underline;
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }
`;

const TextEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 24px;
  background-color: var(--graphite-graphite-20);
  border-top: 1px solid var(--graphite-graphite-80);
`;

const LeftControlsBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-statuses-white-0);

  padding: 6px 16px 8px;
  border-radius: var(--border-radius-element);
  background-color: var(--button-text-green-default);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: var(--button-text-green-hover);
  }

  &:active {
    background-color: var(--button-text-green-active);
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
    background: var(--button-text-graphite-secondary-text);
  }
`;

const ToWhomWrapper = styled.div`
  width: 100%;
  max-width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorWrapper = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-red-default);
`;

const MiniLoaderWrapper = styled.div`
  padding-top: 4px;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const CheckboxTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// in bytes (25mb)
const MAX_EMAIL_FILE_SIZE = 25 * 1024 * 1024;

interface InitialForm {
  subject: InputModel;
  content: InputModel;
  signature: InputModel;
  from: Nullable<number>;
  to: MultiselectModel<string>;
  cc: MultiselectModel<string>;
  bcc: MultiselectModel<string>;
}

interface Props {
  isOpened: boolean;
  to?: string[];
  from?: number;
  subject?: string;
  content?: string;
  entityId?: number;
  entityName?: string;
  entityIcon?: ReactNode;
  fileLinks?: FileLink[];
  headerTitle?: ReactNode;
  entityIconColor?: string;
  replyToMessageId?: number;
  replyTo?: Nullable<string[]>;
  entityEmailOptions?: Option<string>[];
  onClose: (result: boolean) => void;
}

const SendEmailModal = observer((props: Props) => {
  const {
    isOpened,
    subject,
    to = [],
    replyTo,
    content,
    entityId,
    fileLinks,
    entityIcon,
    entityName,
    from = null,
    headerTitle,
    entityIconColor,
    replyToMessageId,
    entityEmailOptions,
    onClose,
  } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.modals.send_email_modal',
  });

  const { settings } = SettingsStore.getSettingsStore<SendEmailModalSettings>('SendEmailModal');

  if (!settings.recents) settings.recents = [];

  const currentUser = authStore.user;

  const fromButtonWrapperRef = useRef<HTMLDivElement>(null);

  const mailboxStore = useMemo(() => new MailboxStore(), []);
  const mailMessageStore = useMemo(() => new MailMessageStore(), []);

  const [signatures, setSignatures] = useState<MailboxSignature[]>([]);

  const [fileModels, setFileModels] = useState<FileModel[]>([]);
  const [preloadedFiles, setPreloadedFiles] = useState<FileLink[]>(() => fileLinks ?? []);

  const [
    isChangesNotSavedModalOpened,
    { close: hideChangesNotSavedModal, open: showChangesNotSavedModal },
  ] = useDisclosure(false);
  const [
    isInvalidEmailAddressModalOpened,
    { close: hideInvalidEmailAddressModal, open: showInvalidEmailAddressModal },
  ] = useDisclosure(false);

  const [areTextFormatControlsShown, { toggle: toggleTextFormatControls }] = useDisclosure(true);
  const [
    isFromDropdownOpened,
    { toggle: toggleFromDropdown, close: hideFromDropdown, open: showFromDropdown },
  ] = useDisclosure(false);

  const [error, setError] = useState<Nullable<string>>(null);
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);

  const [isFromValid, setIsFromValid] = useState(true);
  const [isToWhomValid, setIsToWhomValid] = useState(true);
  const [revalidateInEffect, setRevalidateInEffect] = useState(false);

  const { isSending, sendMessage } = mailMessageStore;
  const { mailboxes, isMailboxInfoLoading, loadMailboxInfo, loadMailboxSignatures } = mailboxStore;

  const { handleFileEvent, areFilesLoading, errorMessages } = useUploadFiles();

  const form = useLocalObservable<InitialForm>(() => ({
    from,
    signature: InputModel.create(),
    subject: InputModel.create(subject),
    content: InputModel.create(content),
    cc: MultiselectModel.create<string>(),
    bcc: MultiselectModel.create<string>(),
    to: MultiselectModel.create<string>(to),
  }));

  useEffect(() => {
    loadMailboxInfo();
  }, [loadMailboxInfo]);

  useEffect(() => {
    const loadSignatures = async (): Promise<void> => {
      if (!form.from) return;

      const signatures = await loadMailboxSignatures(form.from);
      setSignatures(signatures);
    };

    loadSignatures();
  }, [form.from, loadMailboxSignatures]);

  useLayoutEffect(() => {
    const getFromAddress = (): Nullable<number> => {
      if (from) return from;

      if (!currentUser) return null;

      const defaultMailbox = mailboxes.find(m => m.ownerId === currentUser.id);

      return defaultMailbox ? defaultMailbox.id : null;
    };

    form.from = getFromAddress();
  }, [form, currentUser, mailboxes, from]);

  const fromMailboxOptions = useMemo<Option<number>[]>(
    () =>
      mailboxes.map(m => ({
        value: m.id,
        label: m.name,
      })),
    [mailboxes]
  );

  const handleDeletePreloadedFile = useCallback(
    (id: number) => setPreloadedFiles(preloadedFiles.filter(pf => pf.id !== id)),
    [preloadedFiles]
  );

  const handleDeleteFile = useCallback(
    (fileId: string) => setFileModels(fileModels.filter(f => f.id !== fileId)),
    [fileModels]
  );

  const fileItems = useMemo<FileItemModel[]>(
    () => [
      ...preloadedFiles.map<FileItemModel>(pfl => ({
        file: pfl,
        onDelete: () => handleDeletePreloadedFile(pfl.id),
      })),
      ...fileModels.map<FileItemModel>(fm => ({
        file: fm,
        onDelete: () => handleDeleteFile(fm.id),
      })),
    ],
    [preloadedFiles, fileModels, handleDeletePreloadedFile, handleDeleteFile]
  );

  const filesCount = useMemo<number>(() => fileItems.length, [fileItems]);

  const validate = useCallback(() => {
    const isFromValid = form.from !== null;
    const isToWhomValid = form.to.values.length > 0;

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsFromValid(isFromValid);
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsToWhomValid(isToWhomValid);

    return isFromValid && isToWhomValid;
  }, [form.from, form.to.values]);

  useEffect(() => {
    if (revalidateInEffect) validate();
  }, [revalidateInEffect, validate]);

  const onSend = useCallback(
    async (sendAnyway = false): Promise<void> => {
      setRevalidateInEffect(true);

      if (!validate()) return;

      if (!sendAnyway) {
        const isValidEmail = (candidate: string) =>
          InputModel.create(candidate).emailRFC5322().validate();

        const invalidEmails = form.to.values.filter(v => !isValidEmail(v));

        invalidEmails.push(...form.cc.values.filter(v => !isValidEmail(v)));
        invalidEmails.push(...form.bcc.values.filter(v => !isValidEmail(v)));

        setInvalidEmails(invalidEmails);

        if (invalidEmails.length > 0) {
          showInvalidEmailAddressModal();

          return;
        }
      }

      const sendMailMessageDto = new SendMailMessageDto({
        replyTo: null,
        contentText: null,
        subject: form.subject.trimmedValue,
        entityId: entityId ? entityId : null,
        cc: form.cc.values.length > 0 ? form.cc.values : null,
        contentHtml: form.content.value + form.signature.value,
        bcc: form.bcc.values.length > 0 ? form.bcc.values : null,
        fileIds: preloadedFiles.map<string>(f => f.fileInfo.fileId),
        replyToMessageId: replyToMessageId ? replyToMessageId : null,
        sentTo: replyTo ? [...replyTo, ...form.to.values] : form.to.values,
      });

      if (!form.from) return;

      const sendMessageResult = await sendMessage({
        dto: sendMailMessageDto,
        mailboxId: form.from,
        files: fileModels.map<File>(f => f.file),
      });

      if (!sendMessageResult) {
        setError(t('error'));

        return;
      }

      if (!sendMailMessageDto.sentTo) return;

      const { recents } = toJS(settings);

      sendMailMessageDto.sentTo.forEach(e => {
        if (recents.includes(e)) return;

        if (recents.length >= 25) {
          recents.pop();
          recents.unshift(e);
        }

        recents.unshift(e);
      });

      settings.recents = recents;

      onClose(sendMessageResult);
    },
    [
      form,
      replyTo,
      settings,
      entityId,
      fileModels,
      preloadedFiles,
      replyToMessageId,
      t,
      onClose,
      validate,
      sendMessage,
      showInvalidEmailAddressModal,
    ]
  );

  const handleSend = useCallback(() => onSend(), [onSend]);
  const handleSendAnyway = useCallback(() => onSend(true), [onSend]);

  const handleSelectFrom = useCallback(
    (option: Option<number>) => {
      form.from = option.value;

      hideFromDropdown();
    },
    [form, hideFromDropdown]
  );

  const handleLoadFiles = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (e): Promise<void> => {
      const files = await handleFileEvent(e, false);

      if (files)
        setFileModels([
          ...fileModels,
          ...files.map<FileModel>(f => new FileModel(`${f.name}~${UuidUtil.generate()}`, f)),
        ]);
    },
    [handleFileEvent, fileModels]
  );

  const handleDeleteAllFiles = useCallback(() => {
    setFileModels([]);
    setPreloadedFiles([]);
  }, []);

  const handleClose = useCallback(() => {
    const contentChanged =
      (form.content.value !== content && content) || (form.content.value.length > 0 && !content);

    const subjectChanged =
      (form.subject.value !== subject && subject) || (form.subject.value && !subject);

    if (
      JSON.stringify(form.to.values) !== JSON.stringify(to) ||
      subjectChanged ||
      contentChanged ||
      form.cc.values.length > 0 ||
      form.bcc.values.length > 0 ||
      filesCount !== 0
    ) {
      showChangesNotSavedModal();

      return;
    }

    onClose(false);
  }, [form, content, subject, to, filesCount, showChangesNotSavedModal, onClose]);

  const handleChangeTextMode = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      settings.sendAsHTML = e.currentTarget.checked;

      form.content.value = '';
    },
    [settings, form]
  );

  const getEntityOptionsToChoose = useCallback(
    (referenceModel: MultiselectModel<string>): Optional<Option<string>[]> =>
      entityEmailOptions?.filter(e => !referenceModel.values.includes(e.label)),
    [entityEmailOptions]
  );

  const getRecentsOptionsToChoose = useCallback(
    (referenceModel: MultiselectModel<string>): Option<string>[] =>
      settings.recents
        .filter(r => !referenceModel.values.includes(r))
        .map(r => ({
          value: r,
          label: r,
        })),
    [settings.recents]
  );

  const editorShowHTMLProps = useMemo<FTEShowHTMLProps>(
    () => ({ show: settings.sendAsHTML }),
    [settings.sendAsHTML]
  );

  return (
    <OverlayingModal isOpened={isOpened} onClose={handleClose}>
      <FocusTrap active={isOpened}>
        <Root>
          <Header>
            <HeaderTitleWrapper $iconColor={entityIconColor}>
              {entityIcon}
              {entityName}
              {headerTitle}
            </HeaderTitleWrapper>

            <CloseIconWrapper onClick={handleClose}>
              <ModalCloseCrossTertiaryIcon />
            </CloseIconWrapper>
          </Header>

          <Content>
            {error && <ErrorWrapper>{error}</ErrorWrapper>}

            <ToWhomWrapper>
              <MultiAddressMailField
                label={t('to')}
                model={form.to}
                invalid={!isToWhomValid}
                recentsOptions={getRecentsOptionsToChoose(form.to)}
                fromEntityOptions={getEntityOptionsToChoose(form.to)}
              />

              <SendEmailSettingsDropdown settings={settings} />
            </ToWhomWrapper>

            {settings.showCc && (
              <MultiAddressMailField
                model={form.cc}
                label={t('copy')}
                recentsOptions={getRecentsOptionsToChoose(form.cc)}
                fromEntityOptions={getEntityOptionsToChoose(form.cc)}
              />
            )}

            {settings.showBcc && (
              <MultiAddressMailField
                model={form.bcc}
                label={t('hidden_copy')}
                recentsOptions={getRecentsOptionsToChoose(form.bcc)}
                fromEntityOptions={getEntityOptionsToChoose(form.bcc)}
              />
            )}

            <PseudoInputWrapper $invalid={!isFromValid} onClick={toggleFromDropdown}>
              <PseudoInputLabelWrapper>
                <PseudoInputLabel>{t('from')}</PseudoInputLabel>

                <MyDropdown
                  position="bottom-start"
                  opened={isFromDropdownOpened}
                  Button={
                    <div ref={fromButtonWrapperRef}>
                      {isMailboxInfoLoading ? (
                        <MiniLoaderWrapper>
                          <MiniLoader
                            size="small"
                            color="var(--button-text-graphite-secondary-text)"
                          />
                        </MiniLoaderWrapper>
                      ) : (
                        <PseudoInputContent $hoverable>
                          {fromMailboxOptions.find(o => o.value === form.from)?.label}
                        </PseudoInputContent>
                      )}
                    </div>
                  }
                  hide={hideFromDropdown}
                  show={showFromDropdown}
                >
                  <MyDropdownList
                    options={fromMailboxOptions}
                    activeValue={form.from}
                    onSelect={handleSelectFrom}
                  />
                </MyDropdown>
              </PseudoInputLabelWrapper>
            </PseudoInputWrapper>

            <InputWrapper $paddingLeft="60px">
              <InputLabel>{t('subject')}</InputLabel>

              <MyInput model={form.subject} hasBorderBottomLight />
            </InputWrapper>

            <TextEditorWrapper>
              <EmailTextEditor
                contentModel={form.content}
                showHTMLProps={editorShowHTMLProps}
                showToolbar={areTextFormatControlsShown}
              />
              <EmailSignatureEditor
                model={form.signature}
                signatures={signatures}
                firstSignatureDefaultSelected
              />
            </TextEditorWrapper>

            <CheckboxWrapper>
              <MyCheckbox checked={settings.sendAsHTML} onChange={handleChangeTextMode} />
              <CheckboxTitleWrapper>
                {t('send_with_html')}
                <Hint text={t('send_with_html_hint', { company: envUtil.appName })} />
              </CheckboxTitleWrapper>
            </CheckboxWrapper>

            {filesCount > 0 && (
              <AttachmentsBlock>
                <AttachmentsBlockTitleWrapper>
                  <span>
                    {filesCount} {filesCount === 1 ? t('attachment') : t('attachments')}
                  </span>
                  <span>-</span>

                  <DeleteAllButton onClick={handleDeleteAllFiles}>
                    {t('delete_all')}
                  </DeleteAllButton>
                </AttachmentsBlockTitleWrapper>

                <MixedFileList fileItems={fileItems} />
              </AttachmentsBlock>
            )}
          </Content>

          <Controls>
            <LeftControlsBlock>
              <FileInput
                showFiles={false}
                errors={errorMessages}
                showPickerValue={false}
                active={filesCount > 0}
                loading={areFilesLoading}
                fileSizeLimit={MAX_EMAIL_FILE_SIZE}
                onDelete={handleDeleteFile}
                onChange={handleLoadFiles}
              />
              <TextFormatButton
                active={areTextFormatControlsShown}
                toggleActive={toggleTextFormatControls}
              />
            </LeftControlsBlock>

            <SendButton disabled={isSending} onClick={handleSend}>
              {isSending && <MiniLoader />}

              {t('send')}
            </SendButton>
          </Controls>
        </Root>
      </FocusTrap>

      {isChangesNotSavedModalOpened && (
        <ChangesNotSavedModal
          isOpened={isChangesNotSavedModalOpened}
          onSendEmailModalClose={onClose}
          onClose={hideChangesNotSavedModal}
        />
      )}

      {isInvalidEmailAddressModalOpened && (
        <InvalidEmailAddressModal
          isSending={isSending}
          invalidEmails={invalidEmails}
          isOpened={isInvalidEmailAddressModalOpened}
          onApprove={handleSendAnyway}
          onSendEmailModalClose={onClose}
          onClose={hideInvalidEmailAddressModal}
        />
      )}
    </OverlayingModal>
  );
});

SendEmailModal.displayName = 'SendEmailModal';
export { SendEmailModal };
