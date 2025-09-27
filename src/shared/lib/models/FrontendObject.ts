import type { FrontendObjectDto } from '@/app';
import { UtcDate } from './UtcDate';

export class FrontendObject<T extends unknown = unknown> {
  key: string;
  value: T;
  createdAt: UtcDate;

  constructor({ key, value, createdAt }: FrontendObject<T>) {
    this.key = key;
    this.value = value;
    this.createdAt = createdAt;
  }

  static fromDto<T extends unknown = unknown>(dto: FrontendObjectDto<T>): FrontendObject<T> {
    return new FrontendObject({
      key: dto.key,
      value: dto.value,
      createdAt: UtcDate.parseISO(dto.createdAt),
    });
  }
}
