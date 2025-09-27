import type { CalendarInfoDto } from '../../../../api';

export class CalendarInfo {
  id: string;
  title: string;
  primary: boolean;
  readonly: boolean;
  description?: string;
  timeZone?: string;
  color?: string;

  constructor({ id, title, primary, readonly, description, timeZone, color }: CalendarInfo) {
    this.id = id;
    this.title = title;
    this.primary = primary;
    this.readonly = readonly;
    this.description = description;
    this.timeZone = timeZone;
    this.color = color;
  }

  static fromDto(dto: CalendarInfoDto): CalendarInfo {
    return new CalendarInfo({
      id: dto.id,
      title: dto.title,
      primary: dto.primary,
      readonly: dto.readonly,
      description: dto.description,
      timeZone: dto.timeZone,
      color: dto.color,
    });
  }

  static fromDtos(dtos: CalendarInfoDto[]): CalendarInfo[] {
    return dtos.map(this.fromDto);
  }
}
