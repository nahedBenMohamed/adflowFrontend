import { userStore } from '@/app';
import { Hint, PencilButton, TruncateMixin, type Optional } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import {
  type UpdateMailboxDto,
  type UpdateMailboxSettingsManualDto,
  type UpdateMailboxSettingsResult,
} from '../../../../api';
import { MailIcon, MailboxState, type Mailbox } from '../../../../shared';
import { UpdateMailboxModal } from '../Modals/UpdateMailboxModal/UpdateMailboxModal';

const Root = styled.li`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 10px 12px 12px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-element);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;

  .workspace__PencilButton--Root {
    margin-left: auto;

    scale: 0;
    opacity: 0;
  }

  &:hover {
    cursor: pointer;

    .workspace__PencilButton--Root {
      scale: 1;
      opacity: 1;
    }
  }
`;

const EmailWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;
`;

const Email = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const BottomBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MailboxOwner = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;

  color: var(--button-text-graphite-primary-text);
`;

const State = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 4px;

  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: ${p => p.$color};
`;

const ellipsis = keyframes`
  to {
    width: 1.25em;
  }
`;

const Synchronization = styled.div`
  position: relative;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;

  padding-right: 10px;

  &::after {
    content: '...';

    position: absolute;

    width: 0px;
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    -webkit-animation: ${ellipsis} steps(4, end) 1s infinite;
    animation: ${ellipsis} steps(4, end) 1s infinite;
  }
`;

interface Props {
  mailbox: Mailbox;
  isUpdateMailboxModalOpened: boolean;
  handleOpenUpdateMailboxModal: () => void;
  handleCloseUpdateMailboxModal: () => void;
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

const MailboxItem = observer((props: Props) => {
  const {
    mailbox,
    isUpdateMailboxModalOpened,
    updateMailbox,
    handleReconnectGmail,
    updateManualSettings,
    handleOpenUpdateMailboxModal,
    handleCloseUpdateMailboxModal,
  } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_settings_page.components.mailbox_item',
  });

  const { email, ownerId, errorMessage, state } = mailbox;

  const getStateProps = (
    state: MailboxState
  ): Optional<{
    color: string;
    text: string;
    hoverColor?: string;
    hintText?: string;
  }> => {
    switch (state) {
      case MailboxState.INACTIVE:
        return {
          color: 'var(--button-text-red-default)',
          hoverColor: 'var(--button-text-red-hover)',
          text: t('inactive_text'),
          hintText: t('inactive_hint', {
            error: errorMessage
              ? errorMessage
              : 'Error occurred while connecting to mailbox. Please, try again.',
          }),
        };

      case MailboxState.DRAFT:
        return {
          color: 'var(--button-text-graphite-secondary-text)',
          hoverColor: 'var(--button-text-graphite-primary-text)',
          text: t('draft_text'),
          hintText: t('draft_hint'),
        };

      case MailboxState.INIT:
        return {
          color: 'var(--primary-blue)',
          hoverColor: 'var(--button-text-blue-hover)',
          text: t('sync_text'),
          hintText: t('sync_hint'),
        };

      case MailboxState.ACTIVE:
        return {
          color: 'var(--button-text-green-default)',
          text: t('active_text'),
        };

      case MailboxState.DELETED:
      default:
        return;
    }
  };

  const stateProps = getStateProps(state);

  return (
    <>
      <Root onClick={handleOpenUpdateMailboxModal}>
        <EmailWrapper>
          <MailIcon />
          <Email title={email}>{email}</Email>

          <PencilButton />
        </EmailWrapper>

        <BottomBlock>
          <MailboxOwner>{ownerId ? userStore.getById(ownerId).fullName : null}</MailboxOwner>

          {stateProps && (
            <State $color={stateProps.color}>
              {stateProps.hintText && <Hint text={stateProps.hintText} />}

              {state === MailboxState.INIT ? (
                <Synchronization>{stateProps.text}</Synchronization>
              ) : (
                stateProps.text
              )}
            </State>
          )}
        </BottomBlock>
      </Root>

      {isUpdateMailboxModalOpened && (
        <UpdateMailboxModal
          mailbox={mailbox}
          isOpened={isUpdateMailboxModalOpened}
          updateMailbox={updateMailbox}
          onClose={handleCloseUpdateMailboxModal}
          updateManualSettings={updateManualSettings}
          handleReconnectGmail={handleReconnectGmail}
        />
      )}
    </>
  );
});

MailboxItem.displayName = 'MailboxItem';
export { MailboxItem };
