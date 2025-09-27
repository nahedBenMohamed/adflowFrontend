import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import { ChatMessage, ChatMessagesResult, type ChatMessageStatus } from '../../shared';
import { MultichatApiRoutes } from '../MultichatApiRoutes';
import type { SendChatMessageDto, UpdateChatMessageDto } from '../dtos';

const MULTICHAT_CHAT_MESSAGES_LIMIT = 30;

class ChatMessageApi {
  getChatMessages = async (
    chatId: number,
    offset: Nullable<number> = null
  ): Promise<ChatMessagesResult> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MultichatApiRoutes.GET_CHAT_MESSAGES, { chatId }),
      {
        params: {
          offset,
          limit: MULTICHAT_CHAT_MESSAGES_LIMIT,
        },
      }
    );

    return ChatMessagesResult.fromDto(response.data);
  };

  sendChatMessage = async ({
    chatId,
    dto,
  }: {
    chatId: number;
    dto: SendChatMessageDto;
  }): Promise<ChatMessage> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(MultichatApiRoutes.SEND_CHAT_MESSAGE, { chatId }),
      dto
    );

    return ChatMessage.fromDto(response.data);
  };

  updateChatMessage = async ({
    chatId,
    messageId,
    dto,
  }: {
    chatId: number;
    messageId: number;
    dto: UpdateChatMessageDto;
  }): Promise<ChatMessage> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MultichatApiRoutes.UPDATE_CHAT_MESSAGE, { chatId, messageId }),
      dto
    );

    return ChatMessage.fromDto(response.data);
  };

  deleteChatMessage = async ({
    chatId,
    messageId,
  }: {
    chatId: number;
    messageId: number;
  }): Promise<boolean> => {
    const response = await baseApi.delete(
      UrlTemplateUtil.toPath(MultichatApiRoutes.DELETE_CHAT_MESSAGE, { chatId, messageId })
    );

    return response.data;
  };

  updateChatMessageStatus = async ({
    chatId,
    messageId,
    status,
  }: {
    chatId: number;
    messageId: number;
    status: ChatMessageStatus;
  }): Promise<ChatMessage> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MultichatApiRoutes.UPDATE_CHAT_MESSAGE_STATUS, {
        chatId,
        messageId,
        status,
      })
    );

    return ChatMessage.fromDto(response.data);
  };

  updateChatMessagesStatus = async ({
    chatId,
    messageIds,
    status,
  }: {
    chatId: number;
    messageIds: number[];
    status: ChatMessageStatus;
  }): Promise<ChatMessage[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(MultichatApiRoutes.UPDATE_CHAT_MESSAGES_STATUS, { chatId, status }),
      { messageIds }
    );

    return ChatMessage.fromDtos(response.data);
  };

  reactToChatMessage = async ({
    chatId,
    messageId,
    reaction,
  }: {
    chatId: number;
    messageId: number;
    reaction: string;
  }): Promise<ChatMessage> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MultichatApiRoutes.REACT_TO_CHAT_MESSAGE, {
        chatId,
        messageId,
        reaction,
      })
    );

    return ChatMessage.fromDto(response.data);
  };

  unreactToChatMessage = async ({
    chatId,
    messageId,
    reactionId,
  }: {
    chatId: number;
    messageId: number;
    reactionId: number;
  }): Promise<ChatMessage> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MultichatApiRoutes.UNREACT_TO_CHAT_MESSAGE, {
        chatId,
        messageId,
        reactionId,
      })
    );

    return ChatMessage.fromDto(response.data);
  };

  getChatMessage = async ({
    chatId,
    messageId,
  }: {
    chatId: number;
    messageId: number;
  }): Promise<ChatMessage> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MultichatApiRoutes.GET_CHAT_MESSAGE, { chatId, messageId })
    );

    return ChatMessage.fromDto(response.data);
  };
}

export const chatMessageApi = new ChatMessageApi();
