import type { VersionDto } from '@/app';
import { UtcDate } from '../UtcDate';

export class Version {
  id: number;
  version: string;
  date: UtcDate;

  constructor({ id, version, date }: Version) {
    this.id = id;
    this.version = version;
    this.date = date;
  }

  static fromDto(dto: VersionDto): Version {
    return new Version({
      id: dto.id,
      version: dto.version,
      date: UtcDate.parseISO(dto.date),
    });
  }
}
