import type { Nullable } from '@/shared';

export class ChatFindFilterDto {
  entityId?: Nullable<number>;
  phoneNumber?: Nullable<string>;
  transport?: Nullable<null>;
  title?: Nullable<string>;
  providerId?: Nullable<number>;

  constructor({ entityId, phoneNumber, transport, title, providerId }: ChatFindFilterDto) {
    this.entityId = entityId;
    this.phoneNumber = phoneNumber;
    this.transport = transport;
    this.title = title;
    this.providerId = providerId;
  }
}
