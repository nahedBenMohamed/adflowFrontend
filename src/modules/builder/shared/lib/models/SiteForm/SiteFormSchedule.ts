import type { SiteFormScheduleDto } from '../../../../api';

export class SiteFormSchedule {
  scheduleId: number;

  constructor(scheduleId: number) {
    this.scheduleId = scheduleId;
  }

  static fromDto(dto: SiteFormScheduleDto): SiteFormSchedule {
    return new SiteFormSchedule(dto.scheduleId);
  }

  static fromDtos(dtos: SiteFormScheduleDto[]): SiteFormSchedule[] {
    return dtos.map(SiteFormSchedule.fromDto);
  }
}
