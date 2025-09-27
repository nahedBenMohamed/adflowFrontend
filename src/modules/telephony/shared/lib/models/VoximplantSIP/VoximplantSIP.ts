import type { Nullable } from '@/shared';
import type { VoximplantSIPDto } from '../../../../api';
import type { PbxProviderType } from './PbxProviderType';
import { VoximplantSIPRegistration } from './VoximplantSIPRegistration';

export class VoximplantSIP {
  id: number;
  name: string;
  externalId: number;
  type: PbxProviderType;
  userIds?: Nullable<number[]>;
  registration?: VoximplantSIPRegistration;

  private constructor({ id, name, externalId, type, userIds, registration }: VoximplantSIP) {
    this.id = id;
    this.name = name;
    this.externalId = externalId;
    this.type = type;
    this.userIds = userIds;
    this.registration = registration;
  }

  static fromDto(dto: VoximplantSIPDto): VoximplantSIP {
    return new VoximplantSIP({
      id: dto.id,
      name: dto.name,
      type: dto.type,
      userIds: dto.userIds,
      externalId: dto.externalId,
      registration: dto.registration
        ? VoximplantSIPRegistration.fromDto(dto.registration)
        : undefined,
    });
  }

  static fromDtos(dtos: VoximplantSIPDto[]): VoximplantSIP[] {
    return dtos.map(this.fromDto);
  }
}
