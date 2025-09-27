import { CreateContactAndLeadDto, routes } from '@/app';
import { Chat } from '@/modules/multichat';
import {
  UpdateGroupChatDto,
  useCreateContactFromChat,
  useUpdateGroupChat,
} from '@/modules/multichat/api';
import {
  AddRoundButton,
  CreateButton,
  CreateContactModal,
  LinkContactModal,
  MyDropdown,
  SelectOptionItem,
  SelectOptionsList,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  chat: Chat;
  modalWidth: number;
  activeProviderId?: number;
}

const CreateChatContactButton = (props: Props) => {
  const { modalWidth, chat, activeProviderId } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control',
  });

  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);

  const [isCreateContactOpened, { close: hideCreateContactModal, open: showCreateContactModal }] =
    useDisclosure(false);

  const [isLinkContactOpened, { close: hideLinkContactModal, open: showLinkContactModal }] =
    useDisclosure(false);

  const { mutateAsync: createContact } = useCreateContactFromChat({
    chatId: chat.id,
    providerId: activeProviderId,
  });

  const { mutateAsync: linkContact } = useUpdateGroupChat(chat.id);

  const handleCreateContact = async ({
    dto,
    navigateToCard,
  }: {
    navigateToCard: boolean;
    dto: CreateContactAndLeadDto;
  }): Promise<void> => {
    const result = await createContact(dto);

    if (navigateToCard)
      navigate(routes.cardAfterAdd({ entityTypeId: result.entityTypeId, entityId: result.id }));

    hideCreateContactModal();
  };

  const handleLinkContact = async ({
    dto,
    entityTypeId,
    navigateToCard,
  }: {
    navigateToCard: boolean;
    entityTypeId: number;
    dto: UpdateGroupChatDto;
  }): Promise<void> => {
    const result = await linkContact(dto);

    if (navigateToCard && result.entityId)
      navigate(routes.cardAfterAdd({ entityTypeId: entityTypeId, entityId: result.entityId }));

    hideLinkContactModal();
  };

  const handleOpenContactCreation = () => {
    showCreateContactModal();

    close();
  };

  const handleOpenContactLink = () => {
    showLinkContactModal();

    close();
  };

  return (
    <>
      <MyDropdown
        withinPortal
        opened={opened}
        position="bottom-start"
        Button={
          modalWidth > 772 ? (
            <CreateButton customTitle={t('card')} onClick={open} />
          ) : (
            <AddRoundButton label={t('create_card')} onClick={open} />
          )
        }
        show={open}
        hide={close}
      >
        <SelectOptionsList padding="4px">
          <SelectOptionItem label={t('create_card')} onSelect={handleOpenContactCreation} />

          <SelectOptionItem label={t('link_card')} onSelect={handleOpenContactLink} />
        </SelectOptionsList>
      </MyDropdown>

      {isCreateContactOpened && (
        <CreateContactModal
          isOpened={isCreateContactOpened}
          onClose={hideCreateContactModal}
          createContact={handleCreateContact}
        />
      )}

      {isLinkContactOpened && (
        <LinkContactModal
          isOpened={isLinkContactOpened}
          onClose={hideLinkContactModal}
          linkContact={handleLinkContact}
        />
      )}
    </>
  );
};

export { CreateChatContactButton };
