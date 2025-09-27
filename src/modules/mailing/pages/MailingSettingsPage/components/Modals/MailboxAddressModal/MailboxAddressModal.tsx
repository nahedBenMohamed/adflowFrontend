import {
  ConnectGoogleButton,
  DialogModalSecondary,
  InputModel,
  MyInput,
  PrimaryButton,
  envUtil,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GmailIcon, MailboxProvider } from '../../../../../shared';
import { Caption } from '../../Caption/Caption';
import { ModalTitle } from '../ModalTitle/ModalTitle';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px 32px 24px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  margin-bottom: 8px;
`;

const StyledLink = styled(Link)`
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    text-decoration: underline;

    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }
`;

const GmailControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  padding: 16px 24px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  isOpened: boolean;
  loading: boolean;
  provider: MailboxProvider;
  onClose: () => void;
  onApprove: (email: string) => void;
}

const MailboxAddressModal = observer((props: Props) => {
  const { isOpened, loading, provider, onClose, onApprove } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_settings_page.modals.mailbox_address_modal',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpened)
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
  }, [isOpened]);

  const email = useLocalObservable(() => InputModel.create().email());

  const handleApprove = () => {
    if (!email.validate()) return;

    onApprove(email.value);
  };

  const isGmail = provider === MailboxProvider.GMAIL;
  const buttonDisabled = !email.isValid() || !email.trimmedValue.length;

  return (
    <DialogModalSecondary
      width="476px"
      loading={loading}
      isOpened={isOpened}
      height="fit-content"
      maxHeight="fit-content"
      approveTitle={t('continue')}
      approveDisabled={buttonDisabled}
      Header={<ModalTitle>{t('title')}</ModalTitle>}
      CustomControls={
        isGmail && (
          <GmailControlsWrapper>
            <PrimaryButton variant="empty" onClick={onClose}>
              {t('cancel')}
            </PrimaryButton>

            <ConnectGoogleButton disabled={buttonDisabled} onClick={handleApprove} />
          </GmailControlsWrapper>
        )
      }
      onClose={onClose}
      onApprove={handleApprove}
    >
      <Root>
        <Caption>{t('caption1')}</Caption>

        <InputWrapper>
          <MyInput variant="outlined" ref={inputRef} model={email} placeholder={t('placeholder')} />
          {isGmail && <GmailIcon />}
        </InputWrapper>

        <Caption $gray>{t('caption2')}</Caption>

        <Caption $gray>{t('caption3')}</Caption>

        {isGmail && (
          <Caption>
            {t('google_caption1', { company: envUtil.appName })}{' '}
            <StyledLink
              target="_blank"
              rel="noreferrer noopener"
              to="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
            >
              {t('google_policy_link')}
            </StyledLink>{' '}
            {t('google_caption2')}
          </Caption>
        )}
      </Root>
    </DialogModalSecondary>
  );
});

MailboxAddressModal.displayName = 'MailboxAddressModal';
export { MailboxAddressModal };
