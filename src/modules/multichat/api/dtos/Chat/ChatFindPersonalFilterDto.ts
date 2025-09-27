import type { Nullable } from '@/shared';

export class ChatFindPersonalFilterDto {
  fullName?: string;
  providerId?: Nullable<number>;

  constructor({ fullName, providerId }: ChatFindPersonalFilterDto) {
    this.fullName = fullName;
    this.providerId = providerId;
  }
}
