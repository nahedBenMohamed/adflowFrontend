import { DialogModalPrimary } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { GoogleIcon, MailboxProvider } from '../../../../../shared';
import { Caption } from '../../Caption/Caption';
import { ModalTitle } from '../ModalTitle/ModalTitle';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  padding: 16px 32px 24px;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const ProviderBlock = styled.button`
  padding: 0;

  width: 168px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  border: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    border-color: var(--button-text-green-hover);
  }

  &:active {
    border-color: var(--button-text-green-active);
  }
`;

const Manual = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  isOpened: boolean;
  onClose: () => void;
  onApprove: (provider: MailboxProvider) => void;
}

const MailboxProviderModal = (props: Props) => {
  const { isOpened, onApprove, onClose } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_settings_page.modals.mailbox_provider_modal',
  });

  return (
    <DialogModalPrimary
      hideControls
      width="416px"
      maxHeight="240px"
      isOpened={isOpened}
      Header={<ModalTitle>{t('title')}</ModalTitle>}
      onClose={onClose}
    >
      <Root>
        <Caption>{t('caption')}</Caption>

        <List>
          <ProviderBlock onClick={() => onApprove(MailboxProvider.GMAIL)}>
            <GoogleIcon />
          </ProviderBlock>

          <ProviderBlock onClick={() => onApprove(MailboxProvider.MANUAL)}>
            <Manual>{t('manual')}</Manual>
          </ProviderBlock>
        </List>
      </Root>
    </DialogModalPrimary>
  );
};

export { MailboxProviderModal };
