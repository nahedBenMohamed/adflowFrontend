import type { ChatProviderDto } from '../../../../api';
import type { ChatProviderTransport } from './ChatProviderTransport';
import type { ChatProviderType } from './ChatProviderType';

export class ChatProvider {
  id: number;
  type: ChatProviderType;
  transport: ChatProviderTransport;
  title: string;
  unseenCount: number;

  constructor({ id, type, transport, title, unseenCount }: ChatProviderDto) {
    this.id = id;
    this.type = type;
    this.transport = transport;
    this.title = title;
    this.unseenCount = unseenCount;
  }

  static fromDto(dto: ChatProviderDto): ChatProvider {
    return new ChatProvider({
      id: dto.id,
      type: dto.type,
      transport: dto.transport,
      title: dto.title,
      unseenCount: dto.unseenCount,
    });
  }

  static fromDtos(dtos: ChatProviderDto[]): ChatProvider[] {
    return dtos.map(this.fromDto);
  }
}
