import { type ChatMessageReactionDto } from '../../../../api';

export class ChatMessageReaction {
  id: number;
  chatUserId: number;
  reaction: string;

  constructor({ id, chatUserId, reaction }: ChatMessageReactionDto) {
    this.id = id;
    this.chatUserId = chatUserId;
    this.reaction = reaction;
  }

  static fromDto(dto: ChatMessageReactionDto): ChatMessageReaction {
    return new ChatMessageReaction({
      id: dto.id,
      chatUserId: dto.chatUserId,
      reaction: dto.reaction,
    });
  }

  static fromDtos(dtos: ChatMessageReactionDto[]): ChatMessageReaction[] {
    return dtos.map(this.fromDto);
  }
}
