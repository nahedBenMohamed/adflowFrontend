import { DialogModalSecondary, type FileInfo } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ChatMessageFileList } from '../ChatMessageFileList/ChatMessageFileList';
import {
  SEND_CHAT_MESSAGE_TEXTAREA_WRAPPER_CLASS,
  SendChatMessageTextarea,
} from '../SendChatMessageTextarea/SendChatMessageTextarea';

const Root = styled.div`
  display: flex;
  flex-direction: column;

  padding: 16px 32px;
`;

const Controls = styled.div`
  border-top: 1px solid var(--graphite-graphite-80);

  .${SEND_CHAT_MESSAGE_TEXTAREA_WRAPPER_CLASS} {
    padding: 18px 112px 18px 32px;
    box-shadow: none;
  }
`;

interface Props {
  value: string;
  opened: boolean;
  files: FileInfo[];
  sending: boolean;
  setValue: (value: string) => void;
  onDeleteFile: (fileId: string) => void;
  onSend: () => void;
  hide: () => void;
}

const SendChatMessageWithFilesModal = (props: Props) => {
  const { value, opened, files, sending, setValue, onDeleteFile, onSend, hide } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.send_chat_message_with_files_modal',
  });

  return (
    <DialogModalSecondary
      isOpened={opened}
      maxHeight="400px"
      Header={t('send_files')}
      CustomControls={
        <Controls>
          <SendChatMessageTextarea
            autoFocus
            value={value}
            sending={sending}
            sendButtonVisible
            chat={undefined}
            editMessage={null}
            replyToMessage={null}
            setValue={setValue}
            handleSend={onSend}
          />
        </Controls>
      }
      onClose={hide}
    >
      <Root>
        <ChatMessageFileList files={files} onFileDelete={onDeleteFile} alwaysLoadMedia />
      </Root>
    </DialogModalSecondary>
  );
};

export { SendChatMessageWithFilesModal };
