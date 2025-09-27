export class UpdateGroupChatDto {
  title: string;
  entityId: number;
  participantIds: number[];

  private constructor(partialData: Partial<UpdateGroupChatDto>) {
    Object.assign(this, partialData);
  }

  static create(partialData: Partial<UpdateGroupChatDto>): UpdateGroupChatDto {
    return new UpdateGroupChatDto(partialData);
  }
}
