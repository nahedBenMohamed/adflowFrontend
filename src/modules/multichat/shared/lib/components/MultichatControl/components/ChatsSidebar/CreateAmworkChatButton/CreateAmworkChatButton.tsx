import { CreateRoundButton, InputModel, MultiselectModel, envUtil } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  CreateGroupChatDto,
  CreatePersonalChatDto,
  useCreateGroupChat,
  useCreatePersonalChat,
} from '../../../../../../../api';
import type { ChatProvider } from '../../../../../models';
import { AddAvatarAndNameModal, SelectAmworkContactsModal } from './components';

interface Props {
  provider: ChatProvider;
}

const CreateAmworkChatButton = observer((props: Props) => {
  const { provider } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.create_amwork_chat_button',
  });

  const [
    selectContactModalOpened,
    { close: hideSelectContactModal, open: showSelectContactModal },
  ] = useDisclosure(false);

  const [
    addAvatarAndNameModalOpened,
    { close: hideAddAvatarAndNameModal, open: showAddAvatarAndNameModal },
  ] = useDisclosure(false);

  const initialForm = {
    participantsIds: MultiselectModel.create<number>([]),
    groupName: InputModel.create().required(),
  };

  const form = useLocalObservable(() => initialForm);

  const { mutateAsync: createPersonalChat, isPending: personalChatCreating } =
    useCreatePersonalChat();
  const { mutateAsync: createGroupChat, isPending: groupChatCreating } = useCreateGroupChat();

  const handleCreatePersonalChat = async (): Promise<void> => {
    const companionId = form.participantsIds.values[0];

    if (!companionId)
      throw new Error(
        `Failed to create personal chat: companion is not selected, companionId: ${companionId}`
      );

    const dto = new CreatePersonalChatDto({
      companionId,
      providerId: provider.id,
    });

    await createPersonalChat(dto);
  };

  const handleCreateGroupChat = async (): Promise<void> => {
    const dto = new CreateGroupChatDto({
      providerId: provider.id,
      participantIds: form.participantsIds.values,
      title: form.groupName.trimmedValue,
    });

    await createGroupChat(dto);
  };

  const hideSelectContactModalAndClearForm = () => {
    hideSelectContactModal();
    Object.assign(form, initialForm);
  };

  const hideAddAvatarAndNameModalAndClearForm = () => {
    hideAddAvatarAndNameModal();
    Object.assign(form, initialForm);
  };

  const handleApproveSelectedContacts = async (): Promise<void> => {
    if (form.participantsIds.values.length === 1) {
      await handleCreatePersonalChat();
      hideSelectContactModalAndClearForm();

      return;
    }

    hideSelectContactModal();
    showAddAvatarAndNameModal();
  };

  const handleApproveAvatarAndName = async (): Promise<void> => {
    if (!form.groupName.validate()) return;

    await handleCreateGroupChat();
    hideAddAvatarAndNameModal();

    Object.assign(form, initialForm);
  };

  return (
    <>
      <CreateRoundButton
        label={t('label', { company: envUtil.appName })}
        onClick={showSelectContactModal}
      />

      <SelectAmworkContactsModal
        loading={personalChatCreating}
        opened={selectContactModalOpened}
        participantsIds={form.participantsIds}
        onApprove={handleApproveSelectedContacts}
        hide={hideSelectContactModalAndClearForm}
      />

      <AddAvatarAndNameModal
        groupName={form.groupName}
        loading={groupChatCreating}
        opened={addAvatarAndNameModalOpened}
        hide={hideAddAvatarAndNameModalAndClearForm}
        onApprove={handleApproveAvatarAndName}
      />
    </>
  );
});

CreateAmworkChatButton.displayName = 'CreateAmworkChatButton';
export { CreateAmworkChatButton };
