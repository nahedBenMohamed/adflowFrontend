import type { ChatProviderTransport, ChatProviderType } from '../../../shared';

export interface ChatProviderDto {
  id: number;
  type: ChatProviderType;
  transport: ChatProviderTransport;
  title: string;
  unseenCount: number;
}
