export class CreateGroupChatDto {
  providerId: number;
  participantIds: number[];
  title: string;
  entityId?: number;

  constructor({ providerId, participantIds, title, entityId }: CreateGroupChatDto) {
    this.providerId = providerId;
    this.participantIds = participantIds;
    this.title = title;
    this.entityId = entityId;
  }
}
