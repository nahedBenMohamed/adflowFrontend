export class CreatePersonalChatDto {
  providerId: number;
  companionId: number;

  constructor({ providerId, companionId }: CreatePersonalChatDto) {
    this.providerId = providerId;
    this.companionId = companionId;
  }
}
