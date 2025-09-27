import type { SiteFormResultDto } from '@/app';
import type { Nullable } from '@/shared';

export class SiteFormResult {
  result: boolean;
  message: Nullable<string>;

  constructor({ result, message }: SiteFormResult) {
    this.result = result;
    this.message = message;
  }

  static fromDto(dto: SiteFormResultDto): SiteFormResult {
    return new SiteFormResult({
      result: dto.result,
      message: dto.message,
    });
  }
}
