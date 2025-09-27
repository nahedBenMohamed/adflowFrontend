import { baseApi, type CreateContactAndLeadDto } from '@/app';
import { UrlTemplateUtil, type EntityInfo, type Nullable } from '@/shared';
import {
  Chat,
  ChatMessageStatus,
  FindChatsFullResult,
  type ChatProviderTransport,
} from '../../shared';
import { MultichatApiRoutes } from '../MultichatApiRoutes';
import type {
  ChatFindByMessageContentFilterDto,
  ChatFindFilterDto,
  ChatFindPersonalFilterDto,
  CreateExternalChatDto,
  CreateGroupChatDto,
  CreatePersonalChatDto,
  UpdateGroupChatDto,
} from '../dtos';

const MULTICHAT_CHATS_LIMIT = 20;

class ChatApi {
  getChats = async (
    providerId: Nullable<number> = null,
    cursor: Nullable<number> = null
  ): Promise<Chat[]> => {
    const response = await baseApi.get(MultichatApiRoutes.GET_CHATS, {
      params: {
        providerId,
        cursor,
        limit: MULTICHAT_CHATS_LIMIT,
      },
    });

    return Chat.fromDtos(response.data);
  };

  getChat = async (chatId: number): Promise<Chat> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MultichatApiRoutes.GET_CHAT, { chatId })
    );

    return Chat.fromDto(response.data);
  };

  deleteChat = async (chatId: number): Promise<number> => {
    const response = await baseApi.delete(
      UrlTemplateUtil.toPath(MultichatApiRoutes.DELETE_CHAT, { chatId })
    );

    return response.data;
  };

  findFullChats = async ({
    offset = null,
    filter,
  }: {
    offset?: Nullable<number>;
    filter?: ChatFindFilterDto;
  }): Promise<FindChatsFullResult> => {
    const response = await baseApi.get(MultichatApiRoutes.FIND_FULL_CHATS, {
      params: { ...filter, offset, limit: MULTICHAT_CHATS_LIMIT },
    });

    return FindChatsFullResult.fromDto(response.data);
  };

  findFullChatsPersonal = async ({
    offset = null,
    filter,
  }: {
    offset?: Nullable<number>;
    filter?: ChatFindPersonalFilterDto;
  }): Promise<FindChatsFullResult> => {
    const response = await baseApi.get(MultichatApiRoutes.FIND_FULL_CHATS_PERSONAL, {
      params: { ...filter, offset, limit: MULTICHAT_CHATS_LIMIT },
    });

    return FindChatsFullResult.fromDto(response.data);
  };

  findFullChatsByMessageContent = async ({
    offset = null,
    filter,
  }: {
    offset?: Nullable<number>;
    filter?: ChatFindByMessageContentFilterDto;
  }): Promise<FindChatsFullResult> => {
    const response = await baseApi.get(MultichatApiRoutes.FIND_FULL_CHATS_BY_MESSAGE_CONTENT, {
      params: { ...filter, offset, limit: MULTICHAT_CHATS_LIMIT },
    });

    return FindChatsFullResult.fromDto(response.data);
  };

  updateAllChatMessagesStatus = async ({
    chatId,
    status,
  }: {
    chatId: number;
    status: ChatMessageStatus;
  }): Promise<void> => {
    await baseApi.put(
      UrlTemplateUtil.toPath(MultichatApiRoutes.UPDATE_ALL_CHAT_MESSAGES_STATUS, { chatId, status })
    );
  };

  createPersonalChat = async (dto: CreatePersonalChatDto): Promise<Chat> => {
    const response = await baseApi.post(MultichatApiRoutes.CREATE_PERSONAL_CHAT, dto);

    return Chat.fromDto(response.data);
  };

  createGroupChat = async (dto: CreateGroupChatDto): Promise<Chat> => {
    const response = await baseApi.post(MultichatApiRoutes.CREATE_GROUP_CHAT, dto);

    return Chat.fromDto(response.data);
  };

  updateGroupChat = async (chatId: number, dto: UpdateGroupChatDto): Promise<Chat> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(MultichatApiRoutes.UPDATE_GROUP_CHAT, { chatId }),
      dto
    );

    return Chat.fromDto(response.data);
  };

  getChatExists = async (entityId: number): Promise<boolean> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MultichatApiRoutes.GET_CHAT_EXISTS, { entityId })
    );

    return response.data;
  };

  createContactFromChat = async ({
    chatId,
    dto,
  }: {
    chatId: number;
    dto: CreateContactAndLeadDto;
  }): Promise<EntityInfo> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(MultichatApiRoutes.CREATE_CONTACT_FROM_CHAT, { chatId }),
      dto
    );

    return response.data;
  };

  findEntityChats = async ({
    entityId,
    phoneNumber,
    transport,
  }: {
    entityId: number;
    phoneNumber?: string;
    transport?: ChatProviderTransport;
  }): Promise<Chat[]> => {
    const response = await baseApi.get(MultichatApiRoutes.FIND_ENTITY_CHATS, {
      params: { entityId, phoneNumber, transport },
    });

    return Chat.fromDtos(response.data);
  };

  createExternalChat = async (dto: CreateExternalChatDto): Promise<Chat> => {
    const response = await baseApi.post(MultichatApiRoutes.CREATE_EXTERNAL_CHAT, dto);

    return Chat.fromDto(response.data);
  };
}

export const chatApi = new ChatApi();
