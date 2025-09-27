import { type Chat, useMultichatContext } from '@/modules/multichat';
import { type Nullable, type Optional, useUploadFiles } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import styled from 'styled-components';
import {
  SendChatMessageDto,
  UpdateChatMessageDto,
  useSendChatMessage,
  useUpdateChatMessage,
} from '../../../../../../../api';
import type { ChatMessage } from '../../../../../models';
import { SendChatMessageTextarea } from '../SendChatMessageTextarea/SendChatMessageTextarea';
import { SendChatMessageWithFilesModal } from '../SendChatMessageWithFilesModal/SendChatMessageWithFilesModal';

const Root = styled.div`
  width: 100%;

  padding: 0 14px 14px;
`;

interface Props {
  chat: Optional<Chat>;
  chatId: number;
  editMessage: Nullable<ChatMessage>;
  replyToMessage: Nullable<ChatMessage>;
  onSend: () => void;
  providerId?: number;
}

const SendChatMessageBlock = (props: Props) => {
  const { chat, chatId, editMessage, replyToMessage, onSend, providerId } = props;

  const { setEditMessageId, setReplyToId } = useMultichatContext();

  const { mutateAsync: sendMessage, isPending: isSending } = useSendChatMessage({
    chatId,
    providerId,
  });

  const { mutateAsync: updateMessage, isPending: isUpdating } = useUpdateChatMessage({
    chatId,
    messageId: editMessage?.id ?? null,
  });

  const [value, setValue] = useState('');
  const [valueInModal, setValueInModal] = useState('');

  const {
    uploadedFiles,
    errorMessages,
    areFilesLoading,
    deleteUploadedFile,
    handleFileEvent,
    resetUploadedFiles,
  } = useUploadFiles();

  const [sendFilesModalOpened, { close: hideSendFilesModal, open: showSendFilesModal }] =
    useDisclosure(false);

  useEffect(() => {
    if (uploadedFiles.length && !sendFilesModalOpened) {
      showSendFilesModal();

      queueMicrotask(() => {
        setValueInModal(value);
        setValue('');
      });
    }
  }, [uploadedFiles.length, sendFilesModalOpened, value, showSendFilesModal]);

  useEffect(() => {
    if (editMessage) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setValue(editMessage.text);
    }
  }, [editMessage]);

  const trimmedValue = value.trim();

  const handleHideSendFilesModal = () => {
    hideSendFilesModal();
    resetUploadedFiles();

    setValue(valueInModal);
    setValueInModal('');
  };

  const handleSend = async (): Promise<void> => {
    const messageText = sendFilesModalOpened ? valueInModal.trim() : trimmedValue;

    if (!messageText.length && !uploadedFiles.length) return;

    if (editMessage) {
      const dto = new UpdateChatMessageDto({
        text: messageText,
      });

      await updateMessage({ chatId, dto });
    } else {
      const dto = new SendChatMessageDto({
        text: messageText,
        replyToId: replyToMessage?.id ?? null,
        fileIds: uploadedFiles.map<string>(f => f.fileId),
      });

      await sendMessage({ chatId, dto });

      onSend();
    }

    if (sendFilesModalOpened) handleHideSendFilesModal();

    flushSync(() => {
      setEditMessageId(null);
      setReplyToId(null);
      setValue('');
    });
  };

  return (
    <Root>
      <SendChatMessageTextarea
        autoFocus
        chat={chat}
        value={value}
        editMessage={editMessage}
        replyToMessage={replyToMessage}
        sending={isSending || isUpdating}
        fileInputProps={{
          errors: errorMessages,
          loading: areFilesLoading,
          onChange: handleFileEvent,
          onDelete: deleteUploadedFile,
        }}
        setValue={setValue}
        handleSend={handleSend}
      />

      <SendChatMessageWithFilesModal
        value={valueInModal}
        opened={sendFilesModalOpened}
        files={uploadedFiles}
        sending={isSending || isUpdating}
        onSend={handleSend}
        setValue={setValueInModal}
        onDeleteFile={deleteUploadedFile}
        hide={handleHideSendFilesModal}
      />
    </Root>
  );
};

export { SendChatMessageBlock };
