import type { ChatUserExternalDto } from '../ChatUser/ChatUserExternalDto';

export class CreateExternalChatDto {
  title: string;
  providerId: number;
  participantIds: number[];
  entityId?: number;
  externalUser?: ChatUserExternalDto;

  constructor({
    title,
    providerId,
    participantIds,
    entityId,
    externalUser,
  }: CreateExternalChatDto) {
    this.title = title;
    this.providerId = providerId;
    this.participantIds = participantIds;
    this.entityId = entityId;
    this.externalUser = externalUser;
  }
}
