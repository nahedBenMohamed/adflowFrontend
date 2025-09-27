import type { PagingMeta } from '@/shared';
import type { FindChatsFullResultDto } from '../../../../api';
import { Chat } from './Chat';

export class FindChatsFullResult {
  chats: Chat[];
  meta: PagingMeta;

  constructor({ chats, meta }: FindChatsFullResult) {
    this.chats = chats;
    this.meta = meta;
  }

  static fromDto(dto: FindChatsFullResultDto): FindChatsFullResult {
    return new FindChatsFullResult({
      meta: dto.meta,
      chats: Chat.fromDtos(dto.chats),
    });
  }
}
