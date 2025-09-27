import {
  FileInput,
  HideScrollbarMixin,
  MiniLoader,
  MyEmojiPicker,
  insertTextAtCaret,
  setCaretToPos,
  type FileInputProps,
  type Nullable,
  type Optional,
} from '@/shared';
import { FocusTrap, Textarea } from '@mantine/core';
import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { useMultichatContext } from '../../../../../../../context';
import { SendIcon } from '../../../../../../assets';
import type { Chat, ChatMessage } from '../../../../../models';
import { ChatMessageReplyBlock } from '../ChatMessageReplyBlock/ChatMessageReplyBlock';

const TextareaWrapper = styled.div`
  position: relative;

  width: 100%;
  min-height: 56px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  border-radius: 32px;
  padding: 18px 96px 18px 56px;
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
`;

const StyledTextarea = styled(Textarea)`
  .mantine-Textarea-input {
    min-height: 0;

    font-family: var(--system-font-families);
    font-size: 14px;
    line-height: 20px;
    color: var(--button-text-graphite-priory-text);

    border: none;
    border-radius: 0;
    padding: 0;

    &::placeholder {
      color: var(--button-text-graphite-secondary-text);
    }

    ${HideScrollbarMixin}
  }
`;

const FileInputWrapper = styled.div`
  position: absolute;
  left: 24px;
  bottom: 16px;
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  right: 24px;
  bottom: 16px;
`;

const appearAnimation = keyframes`
  0% {
    scale: 0;
    opacity: 0;
  }

  100% {
    scale: 1;
    opacity: 1;
  }
`;

const SendButton = styled.button<{ $visible: boolean }>`
  position: absolute;
  right: 62px;
  bottom: 16px;

  width: 24px;
  height: 24px;

  align-items: center;
  justify-content: center;
  display: ${p => (p.$visible ? 'flex' : 'none')};

  transition: var(--transition-200);
  animation: ${appearAnimation} var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  &:disabled {
    pointer-events: none;
  }
`;

type OmittedFileInputProps = Omit<FileInputProps, 'as' | 'showFiles'>;

interface Props {
  value: string;
  sending: boolean;
  chat: Optional<Chat>;
  editMessage: Nullable<ChatMessage>;
  replyToMessage: Nullable<ChatMessage>;
  sendButtonVisible?: boolean;
  autoFocus?: boolean;
  fileInputProps?: OmittedFileInputProps;
  setValue: (value: string) => void;
  handleSend: () => void;
}

export const SEND_CHAT_MESSAGE_TEXTAREA_WRAPPER_CLASS =
  'workspace__SendChatMessageTextarea--TextareaWrapper';

const SendChatMessageTextarea = (props: Props) => {
  const {
    chat,
    value,
    sending,
    editMessage,
    replyToMessage,
    fileInputProps,
    sendButtonVisible = false,
    autoFocus,
    setValue,
    handleSend,
  } = props;

  const { i18n, t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.send_chat_message_block',
  });

  const { setEditMessageId, setReplyToId } = useMultichatContext();

  const trimmedValue = value.trim();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  };

  const preventEnterWithoutShift = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // to prevent side-effects when typing and spamming Enter
    if (sending) e.preventDefault();

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      handleSend();
    }
  };

  const handleSelectEmoji = (emojiData: EmojiMartData) => {
    const { native } = emojiData;

    if (!textareaRef.current) return;

    const { resultText, selectionStart } = insertTextAtCaret({
      textarea: textareaRef.current,
      text: native,
    });

    setValue(resultText);

    setTimeout(() => {
      if (textareaRef.current)
        setCaretToPos({ textarea: textareaRef.current, pos: selectionStart });
    });
  };

  const handleDisableEditing = () => {
    if (editMessage) {
      setEditMessageId(null);
      setValue('');
    } else {
      setReplyToId(null);
    }
  };

  const replyBlockMessage = editMessage ?? replyToMessage;

  return (
    <TextareaWrapper className={SEND_CHAT_MESSAGE_TEXTAREA_WRAPPER_CLASS}>
      {fileInputProps && (
        <FileInputWrapper>
          <FileInput {...fileInputProps} as="icon-large" showFiles={false} />
        </FileInputWrapper>
      )}

      {replyBlockMessage && (
        <ChatMessageReplyBlock
          chat={chat}
          message={replyBlockMessage}
          isEditing={Boolean(editMessage)}
          onClose={handleDisableEditing}
        />
      )}

      <FocusTrap active={autoFocus}>
        <StyledTextarea
          autosize
          spellCheck
          maxRows={16}
          value={value}
          ref={textareaRef}
          lang={i18n.language}
          placeholder={t('placeholders.message')}
          onChange={handleChange}
          onKeyDown={preventEnterWithoutShift}
        />
      </FocusTrap>

      <SendButton
        disabled={sending}
        $visible={trimmedValue.length > 0 || sendButtonVisible}
        onClick={handleSend}
      >
        {sending ? <MiniLoader color="var(--button-text-graphite-primary-text)" /> : <SendIcon />}
      </SendButton>

      <EmojiPickerWrapper>
        <MyEmojiPicker withinPortal position="top" iconSize="medium" onSelect={handleSelectEmoji} />
      </EmojiPickerWrapper>
    </TextareaWrapper>
  );
};

export { SendChatMessageTextarea };
