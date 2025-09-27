import type { Nullable } from '@/shared';

export class SiteFormResultDto {
  result: boolean;
  message: Nullable<string>;

  constructor({ result, message }: SiteFormResultDto) {
    this.result = result;
    this.message = message;
  }
}
