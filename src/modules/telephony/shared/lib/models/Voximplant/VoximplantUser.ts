import type { VoximplantUserDto } from '../../../../api';

export class VoximplantUser {
  userId: number;
  userName: string;
  isActive: boolean;

  constructor(userId: number, userName: string, isActive: boolean) {
    this.userId = userId;
    this.userName = userName;
    this.isActive = isActive;
  }

  static fromDto(dto: VoximplantUserDto): VoximplantUser {
    return new VoximplantUser(dto.userId, dto.userName, dto.isActive);
  }

  static fromDtos(dtos: VoximplantUserDto[]): VoximplantUser[] {
    return dtos.map(this.fromDto);
  }
}
