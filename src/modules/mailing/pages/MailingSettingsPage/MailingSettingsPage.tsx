import { appStore } from '@/app';
import { RequestSetupFormButton, SettingsPageTemplate } from '@/modules/settings';
import {
  BigPlusIcon,
  HideScrollbarMixin,
  MediaBreakpoints,
  MyIndicator,
  PencilMediumIcon,
  truncateNumber,
  WholePageLoaderWithLogo,
  type Nullable,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  CreateMailboxDto,
  mailboxSettingsApi,
  useGetMailboxesSignatures,
  type UpdateMailboxDto,
  type UpdateMailboxSettingsManualDto,
  type UpdateMailboxSettingsResult,
} from '../../api';
import { MailboxProvider } from '../../shared';
import { mailboxSettingsStore } from '../../store';
import {
  AddButton,
  Caption,
  ControlButton,
  MAILBOX_ID_QUERY_PARAM,
  MailboxAddressModal,
  MailboxList,
  MailboxProviderModal,
  MailboxSignatureModal,
} from './components';

const Root = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  position: fixed;
  z-index: 1;

  height: calc(100dvh - var(--header-height));
  width: var(--mailing-settings-sidebar-width);

  display: flex;
  flex-direction: column;
  gap: 16px;

  overflow: hidden auto;
  padding: 16px 16px 24px 0;
  background: var(--graphite-graphite-20);
  border-right: 1px solid var(--graphite-graphite-80);

  @media ${MediaBreakpoints.SM} {
    position: relative;

    min-width: var(--mailing-settings-sidebar-width);
  }

  ${HideScrollbarMixin}
`;

const Content = styled.div`
  max-width: 575px;

  padding: 24px 16px;
  margin-left: var(--mailing-settings-sidebar-width);

  @media ${MediaBreakpoints.SM} {
    margin-left: 0;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  margin-top: 32px;
`;

const ADD_PROVIDER_QUERY_PARAM = 'add';

const MailingSettingsPage = observer(() => {
  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_settings_page',
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const mailboxIdFromParams = searchParams.get(MAILBOX_ID_QUERY_PARAM);
  const mailboxId = useMemo<Nullable<number>>(
    () => (mailboxIdFromParams ? Number(mailboxIdFromParams) : null),
    [mailboxIdFromParams]
  );
  const isProviderModalOpened = useMemo<boolean>(
    () => searchParams.get(ADD_PROVIDER_QUERY_PARAM) === 'true',
    [searchParams]
  );

  const [provider, setProvider] = useState<Nullable<MailboxProvider>>(null);

  const [isAddressModalOpened, { close: hideAddressModal, open: showAddressModal }] =
    useDisclosure(false);
  const [isSignatureModalOpened, { close: hideSignatureModal, open: showSignatureModal }] =
    useDisclosure(false);

  const { data: mailboxesSignatures } = useGetMailboxesSignatures();

  const {
    isAdding,
    isLoading,
    activeMailboxes,
    notDeletedMailboxes,
    updateMailbox,
    updateMailboxSettingsManual,
  } = mailboxSettingsStore;

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => mailboxSettingsStore.loadMailboxes()
    );
  }, [mailboxId]);

  const handleHideAddProviderModal = () => {
    setSearchParams(prev => {
      prev.delete(ADD_PROVIDER_QUERY_PARAM);

      return prev;
    });
  };

  const handleShowAddProviderModal = () => {
    setSearchParams(prev => {
      prev.set(ADD_PROVIDER_QUERY_PARAM, 'true');

      return prev;
    });
  };

  const handleAddProvider = (provider: MailboxProvider) => {
    setProvider(provider);

    handleHideAddProviderModal();

    showAddressModal();
  };

  const handleConnectGmail = async (id: number): Promise<void> => {
    const url = await mailboxSettingsApi.connectGmailMailbox(id);

    window.location.href = url;
  };

  const handleAddMailbox = async (email: string): Promise<void> => {
    if (!provider) return;

    const dto = new CreateMailboxDto({ email, provider });

    const mailbox = await mailboxSettingsStore.addMailbox(dto);

    hideAddressModal();

    if (mailbox.provider === MailboxProvider.GMAIL) {
      await handleConnectGmail(mailbox.id);
    } else {
      setSearchParams(prev => {
        prev.set(MAILBOX_ID_QUERY_PARAM, String(mailbox.id));

        return prev;
      });
    }
  };

  const handleUpdateManual = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateMailboxSettingsManualDto;
  }): Promise<UpdateMailboxSettingsResult> => {
    return await updateMailboxSettingsManual({ id, dto });
  };

  const handleUpdate = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateMailboxDto;
  }): Promise<void> => {
    await updateMailbox({ id, dto });
  };

  const mailboxesSignaturesCount = useMemo<number>(
    () => (mailboxesSignatures ? mailboxesSignatures.length : 0),
    [mailboxesSignatures]
  );

  if (!appStore.isLoaded)
    return (
      <SettingsPageTemplate noMarginTop>
        <WholePageLoaderWithLogo ensureHeader />
      </SettingsPageTemplate>
    );

  return (
    <SettingsPageTemplate
      pageTitleKey="settings.mailing"
      Controls={<RequestSetupFormButton titleKey="request_setup" />}
      noMarginTop
    >
      <Root>
        <Sidebar>
          <AddButton onClick={handleShowAddProviderModal}>{t('add_button')}</AddButton>

          <MailboxList
            mailboxes={notDeletedMailboxes}
            loading={notDeletedMailboxes.length ? false : isLoading}
            updateMailbox={handleUpdate}
            updateManualSettings={handleUpdateManual}
            handleReconnectGmail={handleConnectGmail}
          />
        </Sidebar>

        <Content>
          <TitleWrapper>
            <Title>{t('mail_templates')}</Title>
            <Caption $gray>{t('templates_caption')}</Caption>
          </TitleWrapper>

          <Controls>
            <MyIndicator
              size={18}
              offset={4}
              disabled={!mailboxesSignaturesCount}
              label={truncateNumber({ num: mailboxesSignaturesCount, precision: 3 })}
            >
              <ControlButton Icon={<PencilMediumIcon />} onClick={showSignatureModal}>
                {t('setup_signature')}
              </ControlButton>
            </MyIndicator>

            <ControlButton Icon={<BigPlusIcon />} disabled>
              {t('add_template')} <i>({t('soon')})</i>
            </ControlButton>
          </Controls>
        </Content>

        {isProviderModalOpened && (
          <MailboxProviderModal
            isOpened={isProviderModalOpened}
            onClose={handleHideAddProviderModal}
            onApprove={handleAddProvider}
          />
        )}

        {isAddressModalOpened && provider && (
          <MailboxAddressModal
            loading={isAdding}
            isOpened={isAddressModalOpened}
            provider={provider}
            onClose={hideAddressModal}
            onApprove={handleAddMailbox}
          />
        )}

        {isSignatureModalOpened && (
          <MailboxSignatureModal
            isOpened={isSignatureModalOpened}
            mailboxes={activeMailboxes}
            onClose={hideSignatureModal}
          />
        )}
      </Root>
    </SettingsPageTemplate>
  );
});

MailingSettingsPage.displayName = 'MailingSettingsPage';
export { MailingSettingsPage };
