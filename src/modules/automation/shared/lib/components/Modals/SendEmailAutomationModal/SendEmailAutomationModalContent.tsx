import { routes, userStore } from '@/app';
import {
  EmailSignatureEditor,
  EmailTextEditor,
  type Mailbox,
  mailboxSettingsStore,
  type MailboxSignature,
  TextFormatButton,
} from '@/modules/mailing';
import type { Nullable, Option, User } from '@/shared';
import {
  type BooleanModel,
  FormItemLabel,
  type FTEShowHTMLProps,
  type InputModel,
  MyCheckboxWithBooleanModel,
  MyInput,
  MySelect,
  MyUsersSelect,
  type Optional,
  type SelectModel,
  SpanWithEllipsis,
  StyledLink,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ActionSendOptionsForm } from '../../../models';
import {
  AutomationBooleanRadioSelect,
  AutomationFormItem,
  AutomationSendOptionsBlock,
  TemplateList,
  WrapperWithLeftOffset,
} from '../components';

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 55%;
  gap: 32px;
`;

const TextEditorWrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  flex: 1;
`;

const EditorControlsWrapper = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;

  display: flex;
  align-items: center;
  gap: 16px;

  z-index: 1;

  padding: 4px;
  border-radius: 32px;
  background-color: var(--primary-statuses-white-0);
`;

const OptionsBlockWrapper = styled.div<{ $hiddenGap?: boolean }>`
  margin-top: 0;
  transition: var(--transition-200);

  ${p => p.$hiddenGap && 'margin-top: -8px'};
`;

export interface SendEmailAutomationModalContentForm {
  content: InputModel;
  userId: SelectModel;
  subject: InputModel;
  signature: InputModel;
  mailboxId: SelectModel;
  sendAsHTML: BooleanModel;
  options: ActionSendOptionsForm;
}

interface Props {
  entityTypeId: number;
  areSignaturesLoading: boolean;
  signatures: MailboxSignature[];
  form: SendEmailAutomationModalContentForm;
}

const LABEL_COLOR = 'var(--button-text-graphite-primary-text)';

const SendEmailAutomationModalContent = observer((props: Props) => {
  const { entityTypeId, areSignaturesLoading, signatures, form } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.send_email_automation_modal',
  });

  const optionsBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    optionsBlockRef.current && autoAnimate(optionsBlockRef.current);
  }, [optionsBlockRef]);

  const [areTextFormatControlsShown, { toggle: toggleTextFormatControls }] = useDisclosure(false);

  const handleChangeMailbox = useCallback(
    (mailboxId: number) => {
      const mailbox = mailboxSettingsStore.getById(mailboxId);

      if (form.userId.value && !mailbox.hasUserAccess(form.userId.value))
        form.userId.setValue(null);
    },
    [form]
  );

  const handleClearEmailContent = useCallback(() => (form.content.value = ''), [form]);

  const showHTMLProps = useMemo<Optional<FTEShowHTMLProps>>(
    () => ({
      maxRows: 16,
      minRows: 16,
      show: form.sendAsHTML.value,
    }),
    [form.sendAsHTML.value]
  );

  const sendersMailboxOptions = useMemo<Option<number>[]>(
    () =>
      mailboxSettingsStore.activeMailboxes.map(m => ({
        value: m.id,
        label: m.email,
      })),
    []
  );

  const mailbox = useMemo<Nullable<Mailbox>>(
    () => (form.mailboxId.value ? mailboxSettingsStore.getById(form.mailboxId.value) : null),
    [form.mailboxId.value]
  );

  const accessibleUsers = useMemo<User[]>(
    () => (mailbox ? userStore.activeUsers.filter(u => mailbox.hasUserAccess(u.id)) : []),
    [mailbox]
  );

  return (
    <>
      <AutomationFormItem gap="16px" text={t('mailing_parameters')}>
        <WrapperWithLeftOffset>
          <SelectWrapper>
            <FormItemLabel $color={LABEL_COLOR}>
              <SpanWithEllipsis text={t('sender_email')} />
            </FormItemLabel>

            <MySelect
              withinPortal
              variant="outlined"
              model={form.mailboxId}
              options={sendersMailboxOptions}
              placeholder={t('placeholders.select_email_address')}
              handleChange={handleChangeMailbox}
            />
          </SelectWrapper>

          <SelectWrapper>
            <FormItemLabel $color={LABEL_COLOR}>
              <SpanWithEllipsis text={t('sender_name')} />
            </FormItemLabel>

            <MyUsersSelect
              withinPortal
              variant="outlined"
              model={form.userId}
              users={accessibleUsers}
              placeholder={t('placeholders.select_user')}
            />
          </SelectWrapper>
        </WrapperWithLeftOffset>
      </AutomationFormItem>

      {form.mailboxId.value && (
        <AutomationFormItem
          hint={t('emails_per_day_hint')}
          text={t('max_number_of_emails_per_day')}
        >
          <WrapperWithLeftOffset>
            <StyledLink
              target="_blank"
              rel="noopener noreferrer"
              to={routes.settingsMailingEditMailbox(form.mailboxId.value)}
            >
              {t('configure_mailbox_limits')}
            </StyledLink>
          </WrapperWithLeftOffset>
        </AutomationFormItem>
      )}

      <AutomationFormItem text={t('options.addresses')}>
        <AutomationBooleanRadioSelect
          model={form.options.enabled}
          trueLabel={t('options.fine_tune_addresses')}
          falseLabel={t('options.all_addresses')}
        />

        <OptionsBlockWrapper ref={optionsBlockRef} $hiddenGap={!form.options.enabled.value}>
          {form.options.enabled.value === 'true' && (
            <AutomationSendOptionsBlock form={form.options} localePrefix="email" />
          )}
        </OptionsBlockWrapper>
      </AutomationFormItem>

      <AutomationFormItem text={t('email_text')}>
        <MyInput variant="outlined" model={form.subject} placeholder={t('placeholders.title')} />

        <TextEditorWrapper>
          <EmailTextEditor
            stickyOffset={0}
            contentModel={form.content}
            showHTMLProps={showHTMLProps}
            showToolbar={areTextFormatControlsShown && !form.sendAsHTML.value}
          />

          <EmailSignatureEditor
            minHeight="104px"
            model={form.signature}
            signatures={signatures}
            loading={areSignaturesLoading}
          />

          <EditorControlsWrapper>
            {!form.sendAsHTML.value && (
              <TextFormatButton
                active={areTextFormatControlsShown}
                toggleActive={toggleTextFormatControls}
              />
            )}
          </EditorControlsWrapper>
        </TextEditorWrapper>

        <TemplateList entityTypeId={entityTypeId} />
      </AutomationFormItem>

      <CheckboxWrapper>
        <MyCheckboxWithBooleanModel
          model={form.sendAsHTML}
          handleChange={handleClearEmailContent}
        />

        {t('send_with_html')}
      </CheckboxWrapper>
    </>
  );
});

SendEmailAutomationModalContent.displayName = 'SendEmailAutomationModalContent';
export { SendEmailAutomationModalContent };
