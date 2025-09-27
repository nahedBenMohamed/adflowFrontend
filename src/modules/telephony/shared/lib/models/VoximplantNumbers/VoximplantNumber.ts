import type { Nullable } from '@/shared';
import type { VoximplantNumberDto } from '../../../../api';

export class VoximplantNumber {
  id: number;
  phoneNumber: string;
  externalId: string;
  userIds?: Nullable<number[]>;

  constructor({ id, phoneNumber, externalId, userIds }: VoximplantNumber) {
    this.id = id;
    this.phoneNumber = phoneNumber;
    this.externalId = externalId;
    this.userIds = userIds;
  }

  static fromDto(dto: VoximplantNumberDto): VoximplantNumber {
    return new VoximplantNumber({
      id: dto.id,
      phoneNumber: dto.phoneNumber,
      externalId: dto.externalId,
      userIds: dto.userIds,
    });
  }

  static fromDtos(dtos: VoximplantNumberDto[]): VoximplantNumber[] {
    return dtos.map(this.fromDto);
  }
}
