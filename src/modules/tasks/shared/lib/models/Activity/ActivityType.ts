import { UtcDate } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { ActivityTypeDto } from '../../../../api';

export class ActivityType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: UtcDate;

  constructor({ id, name, isActive, createdAt }: ActivityType) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.createdAt = createdAt;

    makeAutoObservable(this);
  }

  static fromDto(dto: ActivityTypeDto): ActivityType {
    return new ActivityType({
      id: dto.id,
      name: dto.name,
      isActive: dto.isActive,
      createdAt: UtcDate.parseISO(dto.createdAt),
    });
  }

  static fromDtos(dtos: ActivityTypeDto[]): ActivityType[] {
    return dtos.map(this.fromDto);
  }
}
