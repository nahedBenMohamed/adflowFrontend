import { baseApi } from '@/app';
import { ChatProvider } from '../../shared';
import { MultichatApiRoutes } from '../MultichatApiRoutes';

class ChatProviderApi {
  getChatProviders = async (): Promise<ChatProvider[]> => {
    const response = await baseApi.get(MultichatApiRoutes.GET_CHAT_PROVIDERS);

    return ChatProvider.fromDtos(response.data);
  };
}

export const chatProviderApi = new ChatProviderApi();
