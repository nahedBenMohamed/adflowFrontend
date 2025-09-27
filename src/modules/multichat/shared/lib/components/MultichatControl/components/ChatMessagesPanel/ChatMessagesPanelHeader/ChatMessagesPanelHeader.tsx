import { routes } from '@/app';
import { CreateChatContactButton } from '@/modules/multichat/shared/lib/components/MultichatControl/components/ChatMessagesPanel/CreateChatContactButton/CreateChatContactButton';
import {
  ArrowBackIcon,
  Avatar,
  AvatarCircle,
  FadedHorizontalScrollMixin,
  HideScrollbarMixin,
  InputModel,
  LinkedEntityTag,
  MediaBreakpoints,
  MultiselectModel,
  ParticipantsSelect,
  PencilButton,
  SpanWithEllipsis,
  TruncateMixin,
  debounce,
  useFadedHorizontalScroll,
  type FadedHorizontalScrollMixinProps,
  type Nullable,
  type Optional,
  type UserDropdownItemMeta,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UpdateGroupChatDto, useUpdateGroupChat } from '../../../../../../../api';
import { getNumberFromPx } from '../../../../../helpers';
import { useGetChatsViewInfo } from '../../../../../hooks';
import { ChatProviderType, ChatType, type Chat, type ChatProvider } from '../../../../../models';
import { AddAvatarAndNameModal } from '../../ChatsSidebar/CreateAmworkChatButton/components';
import { ChatControlsMenu } from '../ChatControlsMenu/ChatControlsMenu';

const Root = styled.div<FadedHorizontalScrollMixinProps>`
  display: flex;
  align-items: center;
  gap: 16px;

  overflow-x: auto;
  padding: 14px 24px 14px 32px;
  background-color: var(--primary-statuses-white-0);
  border-bottom: 1px solid var(--graphite-graphite-80);

  ${HideScrollbarMixin}

  @media ${MediaBreakpoints.SM} {
    max-width: calc(100vw - var(--sidebar-width));

    padding: 12px 16px;
  }

  ${FadedHorizontalScrollMixin}
`;

const TitleWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;

  .workspace__PencilButton--Root {
    scale: 0.5;
    opacity: 0;
  }

  &:hover {
    .workspace__PencilButton--Root {
      scale: 1;
      opacity: 1;
    }
  }

  @media ${MediaBreakpoints.SM} {
    width: fit-content;

    flex: 1 0 0;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
`;

const PhoneTag = styled.div`
  height: 20px;
  min-width: 64px;
  max-width: fit-content;

  display: flex;
  align-items: center;
  flex-shrink: 0.5;

  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: var(--button-text-graphite-priory-text);

  padding: 0 4px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--button-text-graphite-secondary-text);

  ${TruncateMixin};

  @media ${MediaBreakpoints.SM} {
    flex-shrink: 0;
  }
`;

const ArrowBackIconWrapper = styled.button`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: #eff5eb;

    svg path {
      fill: var(--button-text-green-active);
    }
  }

  &:active {
    background-color: #e6fbda;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }
`;

interface Props {
  chat: Chat;
  chatProvider: ChatProvider;
  activeProviderId?: number;
  activeProviderType?: ChatProviderType;
  modalWidth?: string;
  mobileView?: boolean;
  onBack?: () => void;
}

interface InitialForm {
  title: InputModel;
  participantIds: MultiselectModel<number>;
}

const ChatMessagesPanelHeader = observer((props: Props) => {
  const { chat, chatProvider, modalWidth, activeProviderId, mobileView, onBack } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control',
  });

  const { mutateAsync: updateChat, isPending: updating } = useUpdateGroupChat(chat.id);

  const [updateModalOpened, { close: hideUpdateModal, open: showUpdateModal }] =
    useDisclosure(false);

  const form = useLocalObservable<InitialForm>(() => ({
    title: InputModel.create(chat.title ?? undefined).required(),
    participantIds: MultiselectModel.create(
      chat
        .getInternalUsers()
        .map<Nullable<number>>(u => u.userId)
        .filter(Boolean)
    ),
  }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateParticipants = useCallback(
    debounce((participantIds: number[]) => {
      const dto = UpdateGroupChatDto.create({ participantIds });

      updateChat(dto);
    }, 500),
    []
  );

  const handleUpdateTitle = async (): Promise<void> => {
    const dto = UpdateGroupChatDto.create({ title: form.title.value });

    await updateChat(dto);

    hideUpdateModal();
  };

  const { ref, showLeftFade, showRightFade } = useFadedHorizontalScroll();

  const { title, companion } = useGetChatsViewInfo(chat);

  const externalUsers = chat.getExternalUsers();
  const chatOwnersIds = chat.getChatOwnersUserIds();
  const chatSupervisorsIds = chat.getSupervisorsUsersIds();
  const externalCompanion = externalUsers.length > 1 ? null : externalUsers[0];

  const entityInfo = chat.entityInfo;
  const isGroupChat = chat.type === ChatType.GROUP;
  const canCreateContact = chatProvider.type !== ChatProviderType.AMWORK && !entityInfo;

  const modalWidthNumber = modalWidth ? getNumberFromPx(modalWidth) : 0;

  const externalUserPhoneNumber = chat.getExternalUsers()[0]?.externalUser?.phone;

  const chatUsersMeta = useMemo<Optional<UserDropdownItemMeta[]>>(() => {
    const result: UserDropdownItemMeta[] = [];

    chatSupervisorsIds.forEach(id =>
      result.push({
        id,
        canSelect: false,
        annotation: t('supervisor'),
      })
    );

    chatOwnersIds.forEach(id =>
      result.push({
        id,
        canSelect: false,
        annotation: t('owner'),
      })
    );

    return result.length > 0 ? result : undefined;
  }, [chatSupervisorsIds, chatOwnersIds, t]);

  return (
    <Root ref={ref} $showLeftFade={showLeftFade} $showRightFade={showRightFade}>
      {mobileView && onBack && (
        <ArrowBackIconWrapper type="button" onClick={onBack}>
          <ArrowBackIcon />
        </ArrowBackIconWrapper>
      )}

      <TitleWrapper>
        <Title>
          <AvatarCircle
            size="large"
            avatar={
              companion
                ? companion.getAvatar()
                : externalCompanion
                  ? externalCompanion.getAvatar()
                  : new Avatar({ avatarUrl: null, firstName: title, lastName: null })
            }
          />

          <SpanWithEllipsis text={title} />

          {externalUserPhoneNumber && (
            <PhoneTag>
              <SpanWithEllipsis text={externalUserPhoneNumber} />
            </PhoneTag>
          )}
        </Title>

        {isGroupChat && <PencilButton active={updateModalOpened} onClick={showUpdateModal} />}
      </TitleWrapper>

      <Controls>
        {canCreateContact && (
          <CreateChatContactButton
            chat={chat}
            activeProviderId={activeProviderId}
            modalWidth={modalWidthNumber}
          />
        )}

        {entityInfo && (
          <LinkedEntityTag
            $maxWidth="160px"
            to={routes.card({
              entityId: entityInfo.id,
              entityTypeId: entityInfo.entityTypeId,
            })}
          >
            <SpanWithEllipsis text={entityInfo.name} />
          </LinkedEntityTag>
        )}

        {isGroupChat && (
          <ParticipantsSelect
            withinPortal
            withoutCurrent
            maxAvatarCount={3}
            usersMeta={chatUsersMeta}
            model={form.participantIds}
            handleChange={debouncedUpdateParticipants}
          />
        )}

        <ChatControlsMenu chat={chat} />
      </Controls>

      {updateModalOpened && (
        <AddAvatarAndNameModal
          loading={updating}
          groupName={form.title}
          opened={updateModalOpened}
          hide={hideUpdateModal}
          onApprove={handleUpdateTitle}
        />
      )}
    </Root>
  );
});

ChatMessagesPanelHeader.displayName = 'ChatMessagesPanelHeader';
export { ChatMessagesPanelHeader };
